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
    let user = await User.findOne({ where: { email: payload.email } });
    user = user.toJSON();
    if (user.role === 'admin') {
      res.user = user;
      next();
    } else {
      utils.sendError(res, { message: 'Unauthorized to view this resource' }, false, 401);
    }
  } catch (err) {
    res.status(401).send('Unauthenticated. Unknown account');
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
    const order = await Parcel.findByPk(req.param.order);
    if (userId === order.toJSON().userId) {
      next();
    } else {
      res.status(401).send('Unauthorized. Only the creator of this order can do that');
    }
  } catch (err) {
    res.status(403).json('Could not find the order requested');
  }
}

export default {
  signJWT,
  requireAuth,
  allowOnlyAdmins,
  allowOnlyOrderCreator,
};
