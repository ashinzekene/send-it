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
  res.json({ message: 'Something exists here' });
});

app.listen(PORT, (err) => {
  if (err) {
    process.stdout.write(err.message);
  } else {
    process.stdout.write(`Server running on port ${PORT}\n`);
  }
});

export default app;
