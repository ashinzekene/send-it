import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const {
  Pool,
} = pg;
let connectionString;
if (process.env.NODE_ENV === 'test') {
  const {
    TEST_DB_USER, TEST_DB_DATABASE, TEST_DB_PASSWORD, TEST_DB_PORT, TEST_DB_HOST,
  } = process.env;
  connectionString = `postgresql://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_DB_DATABASE}`;
} else {
  const {
    DB_USER, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_HOST,
  } = process.env;
  connectionString = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
}

const pool = new Pool({
  connectionString,
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
      isAdmin BOOLEAN,
      password VARCHAR(256) NOT NULL,
      PRIMARY KEY (id)
    )`);
  } catch (err) {
    console.log('Users - ', err.message);
  }
  try {
    await pool.query(`CREATE TYPE status_t AS ENUM('placed', 'transiting', 'delivered', 'cancelled');
      CREATE TYPE metric_t AS ENUM('KG', 'POUNDS')`);
  } catch (err) {
    console.log('TYPE - ', err.message);
  }
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS parcels (
      id SERIAL,
      placedBy INT,
      weight FLOAT,
      weightMetric metric_t,
      sentOn DATE,
      deliveredOn  DATE,
      "status" status_t,
      "from" VARCHAR(120),
      "to" VARCHAR(120),
      currentLocation VARCHAR(120),
      PRIMARY KEY (id),
      FOREIGN KEY (placedBy) REFERENCES users(id))`);
  } catch (err) {
    console.log('PARCEL -', err.message);
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
