const app = require('express')()

app.get('/api', (req, res) => {
  res.send("Hello from Appsody !");
});

app.get('/', function(req, res){
  res.sendFile( __dirname + '/user-app/public/index.html');
});

module.exports.app = app;