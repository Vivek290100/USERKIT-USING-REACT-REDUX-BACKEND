const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../utils/multer'); 
const { authenticateJWT } = require('../middleware/auth');

router.use(authenticateJWT);



router.post('/uploadProfileImage', upload.single('profileImage'), userController.uploadProfileImage);
router.get('/profile', userController.getProfile);
router.delete('/deleteProfileImage', userController.deleteProfileImage);
router.put('/updateProfile', userController.updateProfile);



module.exports = router;



