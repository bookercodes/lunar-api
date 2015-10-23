import express from 'express';
import routes from './routes';

const app = express();

app.use(routes);


app.listen(8080);

export default app;
