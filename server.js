import express from 'express';
import handlebars from 'express-handlebars';
import routes from './routes';

const app = express();


app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(routes);


app.listen(8080);
