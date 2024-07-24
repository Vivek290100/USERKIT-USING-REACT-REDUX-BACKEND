const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);

router.get('/getUsers', adminController.getUsers);

router.delete('/deleteUser/:email', adminController.deleteUser);
router.put('/updateUser/:userId', adminController.updateUserByAdmin);
router.post('/addUser', adminController.addUser);



module.exports = router;
