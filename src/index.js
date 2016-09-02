var express = require('express');
var bot = require('./bot');
var config = require('./config');
var app = express();

app.get('/', (req, res) => { res.send('\n 👋 🌍 \n') });

app.listen(config('PORT'), (err) => {
  if (err) throw err

  console.log(`\n🚀  Planet Express Bot lives on PORT ${config('PORT')} 🚀`)
})
