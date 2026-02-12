// errorHandler.js placeholder
export function errorHandler(err, req, res, next) {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message =
    err.message || "Internal server error. Please try again later.";

  res.status(status).json({ error: message });
}