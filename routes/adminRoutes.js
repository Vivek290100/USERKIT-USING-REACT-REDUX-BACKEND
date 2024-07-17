// backend/routes/adminRoutes.js
const express = require('express');
const { getUsers } = require('../controllers/adminController');
const { authenticateJWT, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/users', authenticateJWT, authorizeAdmin, getUsers);

module.exports = router;
