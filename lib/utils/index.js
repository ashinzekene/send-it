function handleError(err, res, status, log) {
  if (log) console.log(err);
  res.status(status || 403).json({ err: err.message });
}

export default {
  handleError,
};
