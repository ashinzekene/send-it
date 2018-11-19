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
          req.token = token;
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
    const user = await User.getOne(payload.email, 'email');
    if (Number(user.isadmin) === 1) {
      res.user = user;
      next();
    } else {
      utils.sendError(res, { message: 'Unauthorized only for admins' }, false, 401);
    }
  } catch (err) {
    utils.sendError(res, { message: 'Unauthenticated. Unknown account' }, false, 401);
  }
}

/**
 * Allow only users that created an parcel
 * **NOTE** Must insert `requireAuth` middleware first
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
async function allowOnlyParcelCreator(req, res, next) {
  const userId = res.user.id;
  try {
    const parcel = await Parcel.getOne(req.params.parcel);
    if (Number(userId) === parcel.placedby) {
      next();
    } else {
      utils.sendError(res, { message: 'Unauthorized. Only the creator of this parcel can do that' }, false, 401);
    }
  } catch (err) {
    utils.sendError(res, { message: 'Could not find the parcel requested' }, false, 401);
  }
}

export default {
  signJWT,
  requireAuth,
  allowOnlyAdmins,
  allowOnlyParcelCreator,
};
