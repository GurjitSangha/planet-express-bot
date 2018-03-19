var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack(config('WEBHOOK_URL'));
var http = require('http');
var CronJob = require('cron').CronJob;
var bot = require('./bot');
var rp = require('request-promise');
var cheerio = require('cheerio');

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => { res.send('\n👋 🌍\n') });

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Planet Express Bot lives on PORT ${config('PORT')} 🚀`)
});

setInterval(function() {
    http.get("http://planet-express-bot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

app.post('/custom', (req, res) => {
  var message = req.body.message;
  slack.send({text: message});
  res.send('OK');
});

var birthdayJob = new CronJob('00 00 09 * * *', function() {
  var today = new Date();
  var month = today.getMonth() + 1; // zero indexed
  var day = today.getDate();
  var date = day + '/' + month;

  var birthdays = {
    '6/1': 'Tom',
    '11/3': 'Rory',
    '20/4': 'Gary',
    '28/5': 'Aaron',
    '8/7': 'Al',
    '28/8': 'JP',
    '27/10': 'Joe',
    '19/11': 'Matt',
    '26/11': 'Nick',
    '6/12': 'Hosty',
    '31/12': 'Mark'
  }

  if (date in birthdays) {
    var msg = ':birthday: Happy Birthday ' + birthdays[date] + '! :birthday:';
    slack.send({text: msg})
  }
}, null, true, 'Europe/London');

var fridayJob = new CronJob('00 00 08 * * 5', function() {
  var videos = [
    'https://www.youtube.com/watch?v=dP9Wp6QVbsk',
    'https://www.youtube.com/watch?v=Ppm5_AGtbTo',
    'https://www.youtube.com/watch?v=_VVmPYx4VDs'
  ];
  slack.send({text: ':flag-de: ' + videos[Math.floor(Math.random() * videos.length)] + ' :flag-de:'});
}, null, true, 'Europe/London');

var gwotdJob = new CronJob('00 00 10 * * 1-5', function() {
  var options = {
    uri: 'https://www.jabbalab.com/word-of-the-day/german',
    transform: (body) => {
      return cheerio.load(body);
    }
  };

  rp(options)
    .then(($) => {
      var phrase = $('.word .text').text();
      var translation = $('.translation').text();
      var date = $('.date-of-word').text();

      phrase = phrase.slice(0, phrase.length / 2);
      translation = translation.slice(0, translation.length / 2);

      slack.send({text: ':flag-de: Word of the day for ' + date + ': ' + 
                        capFirst(phrase) + ' - ' + capFirst(translation)});
    })
    .catch((err) => {
      console.log(err)
    });
}, null, true, 'Europe/London');

function capFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
