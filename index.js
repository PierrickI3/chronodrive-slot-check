const { chromium } = require('playwright');
const sgMail = require('@sendgrid/mail');

const siteName = 'www.chronodrive.com';
const loginPath = '/login';
const interval = process.env.CHRONODRIVE_SLOT_INTERVAL || 1800000;
const account = {
  login: process.env.CHRONODRIVE_SLOT_LOGIN,
  password: process.env.CHRONODRIVE_SLOT_PASSWORD,
  shopId: process.env.CHRONODRIVE_SLOT_SHOPID,
};
const sendGridApiKey = process.env.CHRONODRIVE_SLOT_SENDGRID_APIKEY;

sgMail.setApiKey(sendGridApiKey);

const checkAvailability = async () => {
  // Create a Chromium browser context
  const crBrowser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const crContext = await crBrowser.newContext();
  const page = await crContext.newPage();

  await crContext.addCookies([
    {
      name: 'chronoShop',
      value: `"shopId=${account.shopId}"`,
      domain: siteName,
      path: '/',
      httpOnly: false,
    },
  ]);

  // Navigate and auto-wait on the page to load after navigation
  await page.goto(`https://${siteName}${loginPath}`);

  // Fill login form elements
  await page.fill('input[name="email_login"]', account.login);
  await page.fill('input[name="pwd_login"]', account.password);

  // Submit form and auto-wait for the navigation to complete
  await page.click('button[class="btn-green"]');
  await page.waitForSelector('//*[@id="header"]/div[1]/div/div[1]/p', 'visible');
  await page.waitForSelector('//*[@id="m_panier"]/div[4]', 'visible');
  const sectionText = await page.$eval('//*[@id="m_panier"]/div[4]', (e) => e.textContent);
  console.log(`${new Date().toLocaleString()}: ${sectionText}`);
  if (sectionText !== 'Pas de créneau disponible') {
    await page.screenshot({ path: `images\\chronodrive-${new Date()}.png` });
    console.log('Créneau trouvé!');
    sendEmail(['pierrick.lozach@genesys.com', 'tessier_veronique@hotmail.com'], 'pierrick.lozach@genesys.com', 'Chronodrive - Créneau trouvé! :-)', sectionText);
  } else {
    //sendEmail(['pierrick.lozach@genesys.com', 'extremesynergy@hotmail.com'], 'pierrick.lozach@genesys.com', 'Pas de créneau trouvé :-(', sectionText);
  }
  await crBrowser.close();
};

function sendEmail(to, from, subject, text, body) {
  console.log('Sending email');

  return new Promise((resolve, reject) => {
    const msg = {
      to: to,
      from: typeof from === 'object' ? from[0] : from,
      subject: subject,
      text: text,
      html: body,
    };

    sgMail
      .send(msg)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

checkAvailability();
setInterval(() => {
  checkAvailability();
}, interval);
