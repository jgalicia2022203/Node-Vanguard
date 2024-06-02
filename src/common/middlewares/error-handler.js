export const errorHandler = (err, res) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "An unexpected error occurred";
  res.status(status).json({ error: message });
};
