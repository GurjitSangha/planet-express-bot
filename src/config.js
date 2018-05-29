var dotenv = require('dotenv')
var ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

var config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
  SLACK_TOKEN: process.env.SLACK_TOKEN,
  FORECAST_TOKEN: process.env.FORECAST_TOKEN,
  SORRY_RORY: process.env.SORRY_RORY,
  SLACK_CHANNEL_ID: process.env.SLACK_CHANNEL_ID,
  FRIDAY: process.env.FRIDAY
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
