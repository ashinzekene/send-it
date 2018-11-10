'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var requireAuth = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, next) {
    var payload, user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return extractPayload(req);

          case 3:
            payload = _context.sent;
            _context.next = 6;
            return _user2.default.getOne({ where: { email: payload.email } });

          case 6:
            user = _context.sent;

            res.user = user.toJSON();
            next();
            _context.next = 14;
            break;

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);

            res.status(401).send('Unauthenticated. Unknown account');

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function requireAuth(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Allow only admins
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */


var allowOnlyAdmins = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, next) {
    var payload, user;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return extractPayload(req);

          case 3:
            payload = _context2.sent;
            _context2.next = 6;
            return _user2.default.findOne({ where: { email: payload.email } });

          case 6:
            user = _context2.sent;

            user = user.toJSON();
            if (user.role === 'admin') {
              res.user = user;
              next();
            } else {
              res.status(401).send('Unauthorized. Only admins are allowed');
            }
            _context2.next = 14;
            break;

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2['catch'](0);

            res.status(401).send('Unauthenticated. Unknown account');

          case 14:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 11]]);
  }));

  return function allowOnlyAdmins(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Allow only users that created an order
 * **NOTE** Must insert `requireAuth` middleware first
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */


var allowOnlyOrderCreator = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res, next) {
    var userId, order;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = req.user.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _parcel2.default.findByPk(req.param.order);

          case 4:
            order = _context3.sent;

            if (userId === order.toJSON().userId) {
              next();
            } else {
              res.status(401).send('Unauthorized. Only the creator of this order can do that');
            }
            _context3.next = 11;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3['catch'](1);

            res.status(403).json('Could not find the order requested');

          case 11:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, this, [[1, 8]]);
  }));

  return function allowOnlyOrderCreator(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

var _parcel = require('../models/parcel');

var _parcel2 = _interopRequireDefault(_parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// const issuer = process.env.JWT_ISSUER || 'send_it';
var secretOrPublicKey = process.env.JWT_SECRET;

function signJWT(id, email, role) {
  return _jsonwebtoken2.default.sign({ id: id, email: email, role: role }, secretOrPublicKey);
}

function extractPayload(req) {
  return new Promise(function (resolve, reject) {
    if (_typeof(req.headers) === 'object') {
      var _req$headers$authoriz = req.headers.authorization.split(' '),
          _req$headers$authoriz2 = _slicedToArray(_req$headers$authoriz, 2),
          token = _req$headers$authoriz2[1];

      _jsonwebtoken2.default.verify(token, secretOrPublicKey, function (err, payload) {
        if (err) {
          reject(err.message);
        } else {
          resolve(payload.id);
        }
      });
    }
  });
}

exports.default = {
  signJWT: signJWT,
  requireAuth: requireAuth,
  allowOnlyAdmins: allowOnlyAdmins,
  allowOnlyOrderCreator: allowOnlyOrderCreator
};