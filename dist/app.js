'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('dotenv/config');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

require('./models/index');

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 4000;

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());
app.use('/api', _index2.default);

app.get('/', function (req, res) {
  res.send('Something exists here');
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Server running on port ' + PORT);
  }
});

exports.default = app;