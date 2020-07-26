const notFoundHanlder = (req, res, next) => {
  res.status(400);
  next(new Error(`Requested route '${req.originalUrl}' does not exists 😔.`))
};

const errorHandler = (err, req, res, next) => {
  const code = res.statusCode !== 200 ? res.statusCode : 500;
  return res.json({
    errorCode: code,
    message: err.message,
    requestURL: req.originalUrl,
    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
  });
};

module.exports = {
  notFoundHanlder,
  errorHandler,
};
