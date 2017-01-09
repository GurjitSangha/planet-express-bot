# planet-express-bot
## Setup
Clone the repo, you need a .env file in the project root that looks something like this. This is what the bot will use when it is running on your own machine (It'll use different ones when live). 
```
NODE_ENV=development
PORT=4000
SLACK_TOKEN=<slack_token_here>
WEBHOOK_URL=<slack_incoming_webhook_here>
```
The slack token is used for the full 'bot' part and the webhook is used for the simple bot and cronjob tasks. You can find the token on sky.slack.com/apps. I've created a private test channel on slack and used the webhook from that integration

After that you can run it like any other node app

## Code
There are two main parts, the full bot and the simple bot

The simple bot lives in index.js and has the custom message and cronjob functionality

The full bot lives in bot.js and has the listen and respond functionality

## License and contributing
This software is distributed under [WTFPL](http://www.wtfpl.net) and you can submit pull requests
