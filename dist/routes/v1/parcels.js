'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  res.json({ message: 'You should get all parcels' });
});

router.get('/:id', function (req, res) {
  res.json({ message: 'Get a parcel by its ID' });
});

exports.default = router;