import express from 'express';
import routes from './routes';
import bodyParser from "body-parser";
import config from "config";
import dbContext from "sequelize-context";
import prettyError from "pretty-error";
import process from "process";
import errorHandler from "errorhandler";
import notFoundHandler from "./middleware/notFoundHandler";

dbContext.connect(config.database, config.username, config.password, {
  logging: false,
  dialect: config.dialect
});

const app = express();

app.use(bodyParser.json());
app.use(routes);
app.use(errorHandler());
app.use(notFoundHandler);
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

export default app;

