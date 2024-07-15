// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUsers, 

} = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

router.get('/users', getUsers);


module.exports = router;