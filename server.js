import express from 'express';
import routes from './routes';
import bodyParser from "body-parser";
import config from "config";
import dbContext from "sequelize-context";

dbContext.connect(config.database, config.username, config.password, {
  logging: false,
  dialect: config.dialect
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


