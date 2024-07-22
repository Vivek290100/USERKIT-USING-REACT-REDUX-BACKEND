// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('Notoken');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  console.log('got token:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded tokn', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { authenticateJWT, authorizeAdmin };
