var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack(config('WEBHOOK_URL'));
var http = require('http');
var CronJob = require('cron').CronJob;
var bot = require('./bot');

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
  if (Math.random() < 0.2) {
    slack.send({text: 'https://www.youtube.com/watch?v=kfVsfOSbJY0'});
  }
}, null, true, 'Europe/London');
