'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createTables = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return pool.query('CREATE TABLE IF NOT EXISTS users (\n      id SERIAL,\n      firstname VARCHAR(40),\n      lastname VARCHAR(40),\n      othername VARCHAR(40),\n      email VARCHAR(256),\n      registered DATE,\n      isAdmin BIT,\n      PRIMARY KEY (id)\n    )');

          case 3:
            _context.next = 5;
            return pool.query('CREATE TABLE IF NOT EXISTS parcel (\n      id SERIAL,\n      placedBy INT,\n      weight FLOAT,\n      weightMetric metric_t,\n      sentOn  DATE,\n      deliveredOn  DATE,\n      "status" status_t,\n      "from" VARCHAR(120),\n      "to" VARCHAR(120),\n      location VARCHAR(120),\n      PRIMARY KEY (id),\n      FOREIGN KEY (placedBy) REFERENCES users(id))');

          case 5:
            _context.next = 7;
            return pool.query('CREATE TYPE status_t AS ENUM(\'placed\', \'transiting\', \'delivered\');\n      CREATE TYPE metric_t AS ENUM(\'KG\', \'POUNDS\')');

          case 7:
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context['catch'](0);

            console.log('Error in query ', _context.t0.message);

          case 12:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function createTables() {
    return _ref.apply(this, arguments);
  };
}();

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

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


pool.on('connect', function () {
  console.log('Connected to pool');
});

pool.on('error', function (err) {
  console.log('Could not connect', err.message);
});

createTables();

exports.default = pool;