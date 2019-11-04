const app = require('express')()

app.get('/', (req, res) => {
  res.send("Hello from Appsody !");
});

app.listen(3001, () => {
  console.log("Listening on 3001")
})

module.exports.app = app;