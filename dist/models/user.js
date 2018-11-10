'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = function () {
  return {
    getAll: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var users;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _index2.default.query('SELECT * FROM USERS');

              case 2:
                users = _context.sent;
                return _context.abrupt('return', users.rows);

              case 4:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getAll() {
        return _ref.apply(this, arguments);
      }

      return getAll;
    }(),
    getOneByID: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
        var query, users;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                query = {
                  text: 'SELECT DISTINCT * FROM users\n      WHERE id=$1',
                  values: [id]
                };
                _context2.next = 3;
                return _index2.default.query(query);

              case 3:
                users = _context2.sent;
                return _context2.abrupt('return', users.rows[0]);

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getOneByID(_x) {
        return _ref2.apply(this, arguments);
      }

      return getOneByID;
    }(),
    create: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(params) {
        var values, query, users;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                values = Object.values(params);
                query = {
                  text: 'INSERT INTO users \n      (firstname, lastname, othername, email, registered, isAdmin) VALUES\n      ($1, $2, $3, $4, $5, $6)',
                  values: values
                };
                _context3.next = 4;
                return _index2.default.query(query);

              case 4:
                users = _context3.sent;
                return _context3.abrupt('return', users.rows);

              case 6:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function create(_x2) {
        return _ref3.apply(this, arguments);
      }

      return create;
    }()
  };
}();