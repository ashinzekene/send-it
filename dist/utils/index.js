"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function handleError(err, res, status, log) {
  if (log) console.log(err);
  res.status(status || 403).json({ err: err.message });
}

exports.default = {
  handleError: handleError
};