var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack(config('WEBHOOK_URL'));
var http = require('http');
var CronJob = require('cron').CronJob;
var axios = require('axios');

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n👋 🌍\n') });

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Planet Express Bot lives on PORT ${config('PORT')} 🚀`)
});

// setInterval(function() {
//     http.get("http://planet-express-bot.herokuapp.com");
// }, 300000); // every 5 minutes (300000)

var counts = {
  'Joe Williams': 0,
  'Rory King': 0,
  'Mark Griffiths': 0,
  'Gurjit Sangha': 0
};

var totals = {
  'Joe Williams': 0,
  'Rory King': 0,
  'Mark Griffiths': 0,
  'Gurjit Sangha': 0
}

var names = {
  'Joe Williams': 'Joe',
  'Rory King': 'Rory',
  'Mark Griffiths': 'Mark',
  'Gurjit Sangha': 'Gary'
}

var victory = {
  'Joe Williams': 'Good news everyone! :farnsworth:',
  'Rory King': 'Good news everyone! :farnsworth:',
  'Mark Griffiths': 'Good news everyone! :farnsworth:',
  'Gurjit Sangha': 'Good news everyone! :farnsworth:'
}

// app.post('/circle_build', (req, res) => {
//   var payload = req.body.payload;
//   var user = payload.committer_name;
//   var status  = payload.status;
//   if (payload.subject === 'Merged branch dev into dev' || payload.subject === "Merge branch 'dev' of github.com:sky-uk/twitter-sentiment into dev")
//     slack.send({text: ':alarm: Merge dev into dev :alarm:'});
//
//   switch(status){
//     case 'failed':
//       statusFailed(user);
//       break;
//     case 'success':
//       statusSuccess(user);
//       break;
//     case 'fixed':
//       statusFixed(user);
//       break;
//   }
//   res.send('OK');
// })

app.post('/custom', (req, res) => {
  var message = req.body.message;
  slack.send({text: message});
  res.send('OK');
})

function statusFailed(user) {
  counts[user]++;
  if (counts[user] < 3)
    slack.send({text: 'Strike ' + counts[user] + ' for ' + names[user] + '!'});
  else {
    slack.send({text: 'Strike ' + counts[user] + ' for ' + names[user] + '! You\'re out! :p45:'});
    counts[user] = 0;
    totals[user]++;
    slack.send({text: 'Total P45\'s for ' + names[user] + ': ' + totals[user]});
  }
}

function statusSuccess(user) {
  slack.send({text: victory[user]});
}

function statusFixed(user) {
  if (counts[user] === 0)
    slack.send({text: 'Well done ' + names[user] + '!'});
  else {
    counts[user] = 0;
    slack.send({text: 'Well done ' + names[user] + '! Your strikes have been reset'})
  }
}

// var quoteJob = new CronJob('00 00 09 * * 1-5', function() {
//   axios.get('https://api.icndb.com/jokes/random')
//     .then(function(res) {
//       if (res.data.type === 'success') {
//         var joke = res.data.value.joke;
//         slack.send({text: 'Daily Chuck Norris Joke: ' + joke});
//       }
//     })
//     .catch(function(err) {
//       console.log(err);
//     })
// }, null, true, 'Europe/London')
//
// var weatherJob = new CronJob('00 00 17 * * 1-5', function() {
//   axios.get('https://api.darksky.net/forecast/' + config('FORECAST_TOKEN') + '/53.790853,-1.53188?units=uk2')
//     .then(function(res) {
//       var tomorrow = res.data.daily.data[1];
//
//       var emoji;
//       switch(tomorrow.icon) {
//         case 'clear-day':
//           emoji = ':sunny:';
//           break;
//         case 'clear-night':
//           emoji = ':crescent_moon:';
//           break;
//         case 'rain':
//           emoji = ':rain_cloud:';
//           break;
//         case 'snow':
//           emoji = ':snowman:';
//           break;
//         case 'sleet':
//           emoji = ':snow_cloud:';
//           break;
//         case 'wind':
//           emoji = ':dash:';
//           break;
//         case 'fog':
//           emoji = ':fog:';
//           break;
//         case 'cloudy':
//           emoji = ':cloud:';
//           break;
//         case 'partly-cloudy-day':
//           emoji = ':partly_sunny:';
//           break;
//         case 'partly-cloudy-night':
//           emoji = ':new_moon:';
//           break;
//         default:
//           emoji = ':sun_with_face:';
//           break;
//       }
//
//       slack.send({
//         text: emoji + ' Tomorrow\'s Weather: ' + tomorrow.summary + ' ' + emoji
//       });
//     })
//     .catch(function(err) {
//       console.log(err);
//     })
// }, null, true, 'Europe/London')
