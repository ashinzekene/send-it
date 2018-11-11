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

async function createTables() {
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL,
      firstname VARCHAR(40),
      lastname VARCHAR(40),
      othername VARCHAR(40),
      email VARCHAR(256) UNIQUE NOT NULL,
      registered DATE,
      isAdmin BIT,
      password VARCHAR(256) NOT NULL,
      PRIMARY KEY (id)
    )`);
    await pool.query(`CREATE TABLE IF NOT EXISTS parcels (
      id SERIAL,
      placedBy INT,
      weight FLOAT,
      weightMetric metric_t,
      sentOn  DATE,
      deliveredOn  DATE,
      "status" status_t,
      "from" VARCHAR(120),
      "to" VARCHAR(120),
      currentLocation VARCHAR(120),
      PRIMARY KEY (id),
      FOREIGN KEY (placedBy) REFERENCES users(id))`);

    await pool.query(`CREATE TYPE status_t AS ENUM('placed', 'transiting', 'delivered');
      CREATE TYPE metric_t AS ENUM('KG', 'POUNDS')`);
  } catch (err) {
    console.log('Error in query ', err.message);
  }
}

pool.on('connect', () => {
  console.log('Connected to pool');
});

pool.on('error', (err) => {
  console.log('Could not connect', err.message);
});

createTables();

export default pool;
