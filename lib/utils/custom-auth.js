import jwt from 'jsonwebtoken';
import User from '../models/user';
import Parcel from '../models/parcel';
import utils from './index';

// const issuer = process.env.JWT_ISSUER || 'send_it';
const secretOrPublicKey = process.env.JWT_SECRET;

function signJWT(id, email, role) {
  return jwt.sign({ id, email, role }, secretOrPublicKey);
}

function extractPayload(req) {
  return new Promise((resolve, reject) => {
    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');
      jwt.verify(token, secretOrPublicKey, (err, payload) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(payload);
        }
      });
    } else {
      reject({ message: 'No Authorization header present' }); // eslint-disable-line
    }
  });
}

async function requireAuth(req, res, next) {
  try {
    const payload = await extractPayload(req);
    const user = await User.getOne(payload.email, 'email');
    res.user = user;
    next();
  } catch (err) {
    utils.sendError(res, err, false, 401);
  }
}

/**
 * Allow only admins
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
async function allowOnlyAdmins(req, res, next) {
  try {
    const payload = await extractPayload(req);
    const user = await User.findOne(payload.email, 'email');
    if (user.isAdmin) {
      res.user = user;
      next();
    } else {
      utils.sendError(res, { message: 'Unauthorized to view this resource' }, false, 401);
    }
  } catch (err) {
    utils.sendError(res, { message: 'Unauthenticated. Unknown account' }, false, 401);
  }
}

/**
 * Allow only users that created an order
 * **NOTE** Must insert `requireAuth` middleware first
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
async function allowOnlyOrderCreator(req, res, next) {
  const userId = req.user.id;
  try {
    const parcel = await Parcel.getOne(req.param.parcel);
    if (userId === parcel.placedBy) {
      next();
    } else {
      utils.sendError(res, { message: 'Unauthorized. Only the creator of this order can do that' }, false, 401);
    }
  } catch (err) {
    utils.sendError(res, { message: 'Could not find the order requested' }, false, 401);
  }
}

export default {
  signJWT,
  requireAuth,
  allowOnlyAdmins,
  allowOnlyOrderCreator,
};
