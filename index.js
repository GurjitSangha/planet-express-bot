var Botkit = require('botkit');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: 'xoxb-75734614263-9IJdYYiOlFkiGAdWjpMcpaMs'
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  var counts = {
    'jw1540': 0,
    'Geit': 0,
    'MarkSG93': 0,
    'GurjitSangha': 0
  };

  var names = {
    'jw1540': 'Joe',
    'Geit': 'Rory',
    'MarkSG93': 'Mark',
    'GurjitSangha': 'Gary'
  }

  controller.hears(['Failed:'], ["direct_message","direct_mention","mention","ambient"], function(bot, message) {
    var split = message.text.split(' ');
    var user = split[2].split("'")[0];
    counts[user]++;

    if (counts[user] < 3)
      bot.reply(message, 'Strike ' + counts[user] + ' for ' + names[user] + '!');
    else {
      bot.reply(message, 'Strike ' + counts[user] + ' for ' + names[user] + '! You\'re out! :p45:');
      counts[user] = 0;
    }
  });

  controller.hears(['Fixed:'], ["direct_message","direct_mention","mention","ambient"], function(bot, message) {
    var split = message.text.split(' ');
    var user = split[2].split("'")[0];
    counts[user] = 0;

    bot.reply(message, 'Well done ' + names[user] + '! Your strikes have been reset');
  });
});
