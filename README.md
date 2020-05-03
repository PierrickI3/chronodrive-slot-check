# Check slots on Chronodrive

This node.js application regularly checks the Chronodrive web site for available slots and sends an email when one is found.

> Only tested on the French Chronodrive site

## Requirements

- [Node.js](https://nodejs.org/)
- A [SendGrid](https://sendgrid.com/) account to send outbound emails (Free up to 40000 for 30 dayss then 100/day forever)
- Your Chronodrive `ShopId`. To find it:
  - Browse to [https://www.chronodrive.com](https://www.chronodrive.com)
  - Log in with your username and password
  - Open the Chrome Developer tools
  - Switch to the `Application` tab
  - Open the Storage\Cookies for https://www.chronodrive.com
  - Find the `chronoShop` entry and note the shopId value (e.g. if the entry is equal to `"shopId=1015"`, then your shop id is `1015`

## Installation

- Clone this repo
- Run `npm i` to install the dependencies
- Set the correct environment variables
  - CHRONODRIVE_SLOT_INTERVAL: Set it to the interval (in milliseconds) to check for slots (default: 1800000 (30 mins)), e.g. `set CHRONODRIVE_SLOT_INTERVAL=1800000`
  - CHRONODRIVE_SLOT_LOGIN: Set it to your username (either xxxxxx if you use your Chronodrive id or your email address), e.g. `set CHRONODRIVE_SLOT_LOGIN=200100`
  - CHRONODRIVE_SLOT_PASSWORD: Set it to your user's password, e.g. `set CHRONODRIVE_SLOT_PASSWORD=<MY PASSWORD>`
  - CHRONODRIVE_SLOT_SHOPID: Set it to your Shop Id (see requirements above). E.g. `set CHRONODRIVE_SLOT_SHOPID=1016`
  - CHRONODRIVE_SLOT_SENDGRID_APIKEY: Set it to your own SendGrid's API Key. See [this page](https://sendgrid.com/docs/ui/account-and-settings/api-keys/) for instructions. E.g. `set CHRONODRIVE_SLOT_SENDGRID_APIKEY=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`

## Usage

- Run `node .`
