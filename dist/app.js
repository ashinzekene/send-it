'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PORT = process.env.PORT || 4000;

var app = (0, _express2.default)();

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