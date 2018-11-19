import express from 'express';
import {} from 'dotenv/config';
import cors from 'cors';
import bodyParser from 'body-parser';
import './models/index';
import routes from './routes/index';

const PORT = process.env.PORT || 4000;

const app = express();

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(bodyParser.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'Something exists here' });
});

app.options('/', (req, res) => {
  console.log('OPTIONS');
  res.json({ msg: 'OPTIONS' });
});

app.listen(PORT, (err) => {
  if (err) {
    process.stdout.write(err.message);
  } else {
    process.stdout.write(`Server running on port ${PORT}\n`);
  }
});

export default app;
