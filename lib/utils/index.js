import bcrypt from 'bcrypt';

const { SALT_ROUNDS } = process.env;

function sendError(res, err, log, status) {
  if (log) console.log(err);
  res.status(status || 403).json({ err: err.message });
}

function sendResponse(res, data, log) {
  if (log) console.log(data);
  res.json({ status: 200, data });
}

async function hashPassword(password) {
  console.log(SALT_ROUNDS);
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export default {
  sendError,
  sendResponse,
  hashPassword,
};
