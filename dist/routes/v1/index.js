'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

var _parcels = require('./parcels');

var _parcels2 = _interopRequireDefault(_parcels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/user', _users2.default);

router.use('/parcel', _parcels2.default);

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to the version 1 API' });
});

exports.default = router;