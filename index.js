const express      = require("express");
const routes       = require('./routes');
const bodyParser   = require("body-parser");
const config       = require("config");
const dbContext    = require("sequelize-context");
const prettyError  = require("pretty-error");
const process      = require("process");
const errorHandler = require("errorhandler");

prettyError.start();

dbContext.connect(config.database, config.username, config.password, {
  logging: false,
  dialect: config.dialect
});

const app = express();

app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler());
app.disable('etag');

app.use(function(err, req, res, next) {
  if (err.isBoom) {
    res
      .status(400)
      .json(err.data);
  }
  next();
});

// do not listen if the server was started by the test
// runner, otherwise you'll get "port in use" errors.
const testing = process.env.NODE_ENV === "test";
if (!testing) {
  app.listen(8080);
}

module.exports = app;

