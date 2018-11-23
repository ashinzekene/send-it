import bcrypt from 'bcrypt';

export const { SALT_ROUNDS } = process.env;

export const ORDER_STATUSES = {
  placed: 'placed',
  transiting: 'transiting',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

export function sendError(res, err, log, status) {
  if (log) console.log(err);
  res.status(status || 403).json({ error: err.message, status });
}

export function sendResponse(res, data, log) {
  if (log) console.log(data);
  res.json({ status: 200, data });
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(+SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function comparePassword(password, hash) {
  const isSame = await bcrypt.compare(password, hash);
  return isSame;
}
