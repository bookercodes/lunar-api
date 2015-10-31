import express from 'express';
import routes from './routes';
import bodyParser from "body-parser";
import config from "config";
import orm from "./lib/orm";

orm.logger = false;
orm.discover = [__dirname + '/models/'];
orm.connect(config.db.name, config.db.user, config.db.pass, {
  logging: false,
  dialect: config.db.dialect
});

const app = express();

app.use(bodyParser.json());
app.use(routes);

app.use(function(err, req, res, next) {
  if (err.isBoom) {
    res
      .status(400)
      .json(err.data);
  }
  next();
});

const server = app.listen(8080);

export default {
  app: app,
  server: server
};


