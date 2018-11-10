import express from 'express';
import {} from 'dotenv/config';
import bodyParser from 'body-parser';
import './models/index';
import routes from './routes/index';

const PORT = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Something exists here');
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server running on port ${PORT}`);
  }
});

export default app;
