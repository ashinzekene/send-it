import bcrypt from 'bcrypt';

const { SALT_ROUNDS } = process.env;

function sendError(res, err, log, status) {
  if (log) console.log(err);
  res.status(status || 403).json({ error: err.message, status });
}

function sendResponse(res, data, log) {
  if (log) console.log(data);
  res.json({ status: 200, data });
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(+SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

async function comparePassword(password, hash) {
  const isSame = await bcrypt.compare(password, hash);
  return isSame;
}

export default {
  sendError,
  sendResponse,
  hashPassword,
  comparePassword,
};
