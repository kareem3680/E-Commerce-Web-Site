const sendError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const globalError = (err, req, res, next) => {
  sendError(err, res);
};

module.exports = globalError;
