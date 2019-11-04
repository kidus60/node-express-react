// Requires statements and code for non-production mode usage
if (!process.env.NODE_ENV || !process.env.NODE_ENV === 'production') {
  require('appmetrics-dash').attach();
}
require('appmetrics-prometheus').attach();

const express = require('express');
const bodyParser = require('body-parser');
const health = require('@cloudnative/health-connect');
const fs = require('fs');
const path = require('path');
const healthcheck = new health.HealthChecker();
const basePath = __dirname + '/user-app/';
// Register the users app. As this is before the health/live/ready routes,
// those can be overridden by the user
const userApp = require(basePath + getEntryPoint()).app;

const app = express();

function getEntryPoint() {
    let rawPackage = fs.readFileSync(basePath + 'package.json');
    let package = JSON.parse(rawPackage);
    if (!package.main) {
        console.error("Please define a primary entrypoint of your application by agdding 'main: <entrypoint>' to package.json.")
        process.exit(1)
    }
    return package.main;
}


app.use('/', userApp);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/live', health.LivenessEndpoint(healthcheck));
app.use('/ready', health.ReadinessEndpoint(healthcheck));
app.use('/health', health.HealthEndpoint(healthcheck));

app.get('*', (req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App started on PORT ${PORT}`);
});

// Export server for testing purposes
module.exports.server = server;
module.exports.PORT = PORT;
