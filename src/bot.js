var Botkit = require('botkit');
var controller = Botkit.slackbot();
var config = require('./config');
var bot = controller.spawn({
  token: config('SLACK_TOKEN')
});

bot.startRTM(function(err, bot, payload) {
  if (err)
    throw new Error('Could not connect to Slack');

  controller.hears(['echo'], ['direct_mention'], function(bot, message) {
    var split = message.text.split(' ');
    // remove 'echo' and join the remaining elements
    split.shift();
    bot.reply(message, split.join(' '));
  })
})

module.exports = bot;
