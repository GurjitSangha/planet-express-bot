var dotenv = require('dotenv')
var ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

var config = {
  ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SLACK_TOKEN: process.env.SLACK_TOKEN
}

module.exports = (key) => {
  if (!key) return config

  return config[key]
}
