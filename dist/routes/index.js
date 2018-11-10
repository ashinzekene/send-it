'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('./v1/index');

var _index2 = _interopRequireDefault(_index);

var _index3 = require('./v2/index');

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.use('/v1', _index2.default);
router.use('/v2', _index4.default);

exports.default = router;