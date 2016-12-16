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

setInterval(function() {
    http.get("http://planet-express-bot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

app.post('/custom', (req, res) => {
  var message = req.body.message;
  slack.send({text: message});
  res.send('OK');
})

var lunchJob = new CronJob('00 00 12 * * 1-5', function() {
  // Get a random int between 1 and 40
  var min = 1;
  var max = 40;
  var rand = Math.floor(Math.random() * (max - min)) + min;

  setTimeout(function() {
    slack.send({text: 'Lunch?'});
  }, rand * 60 * 1000);
}, null, true, 'Europe/London');
