import express from 'express';

const PORT = process.env.PORT || 4000;

const app = express();

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
