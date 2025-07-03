// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const status = err.status || 500;
  const message = isProduction
    ? 'An unexpected error occurred. Please try again later.'
    : err.message || 'An error occurred.';
  const response = { error: message };
  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }
  res.status(status).json(response);
};

export default errorHandler;
