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
  });

  controller.hears(['olcb'], ['ambient'], function(bot, message) {
    bot.reply(message, 'Hey, that\'s me!');
  });

  controller.hears(['parrot'], ['ambient', 'direct_mention'], function(bot, message) {
    var parrots = [':parrot:', ':parrot-aussie:', ':parrot-christmas:', 'parrot-deal-with-it', ':parrot-middle:', ':bored_parrot:', ':chill_parrot:',
      ':parrot-right:', ':parrot-slow:', ':parrotcop:', ':fast_parrot', ':icecream_parrot:', ':confusedparrot:', ':explodingparrot:',
      ':fiestaparrot:', ':reversecongaparrot:', ':sadparrot:'];

    var parrot = parrots[Math.floor(Math.random() * parrots.length)];

    bot.reply(message, parrot);
  });

  controller.hears([''], ['ambient'], function(bot, message) {
    if (message.user == 'U1QA4QGP3') {
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: '-1'
      });
    }
  });
})

module.exports = bot;
