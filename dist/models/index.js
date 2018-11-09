'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
var Pool = _pg2.default.Pool;


console.log('User', process.env.DB_USER);

var pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

console.log('Creating Tables');
pool.query('CREATE TABLE IF NOT EXISTS users (\n  id INT,\n  firstname VARCHAR(20),\n  lastname VARCHAR(20),\n  othername VARCHAR(20),\n  email VARCHAR(20),\n  registered DATE,\n  isAdmin BIT,\n  PRIMARY KEY (id)\n)').then(function () {
  return pool.query('CREATE TYPE status_t AS ENUM(\'placed\', \'transiting\', \'delivered\');\n    CREATE TYPE metric_t AS ENUM(\'KG\', \'POUNDS\');\n    \n    CREATE TABLE IF NOT EXISTS parcel (\n    id INT,\n    placedBy INT,\n    weight Float,\n    weightMetric metric_t,\n    sentOn  DATE,\n    deliveredOn  DATE,\n    "status" status_t,\n    "from" VARCHAR(40),\n    "to" VARCHAR(40),\n    location VARCHAR(40),\n    PRIMARY KEY (id),\n    FOREIGN KEY (placedBy) REFERENCES users(id))');
}).catch(function (err) {
  console.log(err);
});

pool.on('connect', function () {
  console.log('Connected to pool');
});

pool.on('error', function (err) {
  console.log('Could not connect', err.message);
});

exports.default = {
  pool: pool
};