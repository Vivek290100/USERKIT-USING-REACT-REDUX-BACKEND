const errorHandler = (err, req, res, next) => {
  console.error('Error Handler:', err.message);
  res.status(500).json({ message: 'Server error' });
};

module.exports = errorHandler;
