import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

console.log('User', process.env.DB_USER);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

console.log('Creating Tables');
pool.query(`CREATE TABLE IF NOT EXISTS users (
  id INT,
  firstname VARCHAR(20),
  lastname VARCHAR(20),
  othername VARCHAR(20),
  email VARCHAR(20),
  registered DATE,
  isAdmin BIT,
  PRIMARY KEY (id)
)`).then(() => pool.query(`CREATE TYPE status_t AS ENUM('placed', 'transiting', 'delivered');
    CREATE TYPE metric_t AS ENUM('KG', 'POUNDS');
    
    CREATE TABLE IF NOT EXISTS parcel (
    id INT,
    placedBy INT,
    weight Float,
    weightMetric metric_t,
    sentOn  DATE,
    deliveredOn  DATE,
    "status" status_t,
    "from" VARCHAR(40),
    "to" VARCHAR(40),
    location VARCHAR(40),
    PRIMARY KEY (id),
    FOREIGN KEY (placedBy) REFERENCES users(id))`))
  .catch((err) => {
    console.log('Some error occurred during running the query', err.message);
  });


pool.on('connect', () => {
  console.log('Connected to pool');
});

pool.on('error', (err) => {
  console.log('Could not connect', err.message);
});

export default {
  pool,
};
