import express from 'express';
import routes from './routes';
import bodyParser from "body-parser";

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

app.listen(8080);

export default app;
