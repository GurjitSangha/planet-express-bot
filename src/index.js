var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var slack = new Slack(config('WEBHOOK_URL'));
var http = require('http');

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

app.post('/circle_build', (req, res) => {
  var payload = req.body.payload;
  var user = payload.committer_name;
  var status  = payload.status;
  if (payload.subject === 'Merged branch dev into dev')
    slack.send({text: ':alarm: Merge dev into dev :alarm:'});

  switch(status){
    case 'failed':
      statusFailed(user);
      break;
    case 'success':
      statusSuccess(user);
      break;
    case 'fixed':
      statusFixed(user);
      break;
  }
  res.send('OK')
})

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
