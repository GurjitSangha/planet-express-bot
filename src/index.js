var express = require('express');
var config = require('./config');
var bodyParser = require('body-parser');
var Slack = require('node-slack');
var SlackUpload = require('node-slack-upload');
var slack = new Slack(config('WEBHOOK_URL'));
var slackUpload = new SlackUpload(config('SLACK_TOKEN'))
var http = require('http');
var CronJob = require('cron').CronJob;
var bot = require('./bot');
var rp = require('request-promise');
var cheerio = require('cheerio');
var http = require('http');
var fs = require('fs');
var path = require('path');
var request = require('request');

var app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('\n👋 🌍\n');
});

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

var fridayJob = new CronJob('00 00 09 * * 5', function() {
  if (config('FRIDAY')) {
    slack.send({text: 'https://www.youtube.com/watch?v=kfVsfOSbJY0'});
  }
}, null, true, 'Europe/London');

// var tamilJob = new CronJob('00 00 09 * * 1-5', function() {
//   var options = {
//     uri: 'https://agarathi.com/wod',
//     transform: (body) => {
//       return cheerio.load(body);
//     }
//   };

//   rp(options)
//     .then(($) => {
//       const tamil = $('.timeline-title').first().text().trim();
//       const desc = $('.description').first().text().trim();

//       slack.send({ text: `Today's Tamil word of the day is ${tamil} - ${desc}` });
//       res.send(`Today's Tamil word of the day is ${tamil} - ${desc}`);
//     })
// }, null, true, 'Europe/London');

// var gwotdJob = new CronJob('00 50 09 * * 1-5', function() {
//   return;
//   var options = {
//     uri: 'https://www.jabbalab.com/word-of-the-day/german',
//     transform: (body) => {
//       return cheerio.load(body);
//     }
//   };

//   rp(options)
//     .then(($) => {
//       var phrase = cutInHalf($('.word .text').text());
//       var translation = cutInHalf($('.translation').text());
//       var date = $('.date-of-word').text();

//       var text = 'The final :flag-de: Word of the day for ' + date + ': ' + 
//                   capFirst(phrase) + ' - ' + capFirst(translation);

//       var phrase = cutInHalf($('.word .text').text());
//       var raw = $('.word').html()
//       var start = raw.indexOf('/audio/german')
//       var end = raw.indexOf('"', start)
//       var phraseUrl = 'http://www.jabbalab.com' + raw.substring(start, end)
//       saveAndUploadMP3(phraseUrl, capFirst(phrase), text)
//         .then((data) => {
//           var origSentence = cutInHalf($('.sentence-row .original').text());
//           var tranSentence = cutInHalf($('.sentence-row .translated').text());
//           var directSentence = cutInHalf($('.sentence-row .dt').text());
//           var comment = tranSentence + ' (Direct: ' + directSentence + ')';
//           var insertPos = phraseUrl.length - 4;
//           var sentenceUrl = [phraseUrl.slice(0, insertPos), 'sentence', phraseUrl.slice(insertPos)].join('');  
//           saveAndUploadMP3(sentenceUrl, origSentence, comment);
//         })
//         .catch((error) => {
//           console.log(error)
//         })
//     })
//     .catch((err) => {
//       console.log(err)
//     });
// }, null, true, 'Europe/London');

// function saveAndUploadMP3(url, title, comment) {
//   var file = fs.createWriteStream("file.mp3");
//   return new Promise((resolve, reject) => {
//     http.get(url, (response) => {
//       response.pipe(file);
      
//       file.on('finish', () => {
//         options = {
//           file: fs.createReadStream(path.join(__dirname, '..', 'file.mp3')),
//           fileType: 'mp3',
//           title: title,
//           channels: config('SLACK_CHANNEL_ID'),
//         };
//         if (comment) {
//           options['initialComment'] = comment
//         }
//         slackUpload.uploadFile(options, (err, data) => {
//           if (err)
//             reject(new Error(err));
//           else
//             resolve(data);
//         });
//       });
//     });
//   });
// }

// function capFirst(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }

// function cutInHalf(str) {
//   return str.slice(0, str.length / 2)
// }
