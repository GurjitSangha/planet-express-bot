var Botkit = require('botkit');
var controller = Botkit.slackbot();
var config = require('./config');
var bot = controller.spawn({
  token: config('SLACK_TOKEN')
});
var request = require('request');

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
    var parrots = [':parrot:', ':parrot-aussie:', ':parrot-christmas:', 'parrot-deal-with-it',
      ':parrot-middle:', ':bored_parrot:', ':chill_parrot:', ':parrot-right:', ':parrot-slow:',
      ':parrotcop:', ':fast_parrot:', ':icecream_parrot:', ':confusedparrot:', ':explodingparrot:',
      ':fiestaparrot:', ':reversecongaparrot:', ':sadparrot:', ':raresiren:', ':coffee-parrot:',
      ':parrot-blonde-sassy:', ':parrot-fieri:', ':parrot-kebab:', ':parrot-middle:', ':parrot-moustache:',
      ':parrot-ship-it:', ':parrot-ski:', ':parrot-stable:', ':parrot-triplets:', ':parrot-twins',
      ':parrot-witness-protection:', ':parrot-nyan', 'potterparrot', 'parrot-burger', 'gentlemanparrot'];

    var parrot = parrots[Math.floor(Math.random() * parrots.length)];

    bot.reply(message, parrot);
  });

  controller.hears(['8ball!'], ['ambient'], function(bot, message) {
    var answers = [
      'It is certain',
      'It is decidedly so',
      'Without a doubt',
      'Yes, definitely',
      'You may rely on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      'Don\'t count on it',
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful'
    ];

    var answer = answers[Math.floor(Math.random() * answers.length)];

    bot.reply(message, answer);
  });

  controller.hears(['insult!'], ['ambient'], function(bot, message) {
    var split = message.text.split(' ');
    split.shift();
    var name = split[0];

    request('http://quandyfactory.com/insult/json', function(err, res, body) {
      if (res.statusCode == 200) {
        var json = JSON.parse(body);
        var insult = name + ', ' + json.insult.charAt(0).toLowerCase() + json.insult.slice(1);
        bot.reply(message, insult);
      }
    })
  });

  controller.hears([''], ['ambient'], function(bot, message) {
    if (message.user == 'U1QA4QGP3' && config('SORRY_RORY') == 'on') {
      bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: '-1'
      });
    }
  });
})

module.exports = bot;
