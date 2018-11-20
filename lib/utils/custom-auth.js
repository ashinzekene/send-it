import jwt from 'jsonwebtoken';
import User from '../models/user';
import Parcel from '../models/parcel';
import { sendError, ORDER_STATUSES } from '.';

// const issuer = process.env.JWT_ISSUER || 'send_it';
export const secretOrPublicKey = process.env.JWT_SECRET;

export function signJWT(id, email, role) {
  return jwt.sign({ id, email, role }, secretOrPublicKey);
}

export function extractPayload(req) {
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

export async function requireAuth(req, res, next) {
  try {
    const payload = await extractPayload(req);
    const user = await User.getOne(payload.email, 'email');
    res.user = user;
    next();
  } catch (err) {
    sendError(res, err, false, 401);
  }
}

/**
 * Allow only admins
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export async function allowOnlyAdmins(req, res, next) {
  try {
    const payload = await extractPayload(req);
    const user = await User.getOne(payload.email, 'email');
    if (Number(user.isadmin) === 1) {
      res.user = user;
      next();
    } else {
      sendError(res, { message: 'Unauthorized only for admins' }, false, 401);
    }
  } catch (err) {
    sendError(res, { message: 'Unauthenticated. Unknown account' }, false, 401);
  }
}

/**
 * Allow only users that created an parcel
 * **NOTE** Must insert `requireAuth` middleware first
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Function} next
 */
export async function allowOnlyParcelCreator(req, res, next) {
  const userId = res.user.id;
  try {
    const parcel = await Parcel.getOne(req.params.parcel);
    if (Number(userId) === parcel.placedby) {
      next();
    } else {
      sendError(res, { message: 'Unauthorized. Only the creator of this parcel can do that' }, false, 401);
    }
  } catch (err) {
    sendError(res, { message: 'Could not find the parcel requested' }, false, 404);
  }
}

export async function orderNotDelivered(req, res, next) {
  try {
    const parcel = await Parcel.getOne(req.params.parcel);
    if (parcel.deliveredon) {
      sendError(res, { message: 'This parcel has already been delivered' }, false, 403);
      return;
    }
    next();
  } catch (err) {
    sendError(res, { message: 'Parcel not found' }, false, 404);
  }
}
