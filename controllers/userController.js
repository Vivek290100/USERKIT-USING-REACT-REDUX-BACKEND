const User = require('../models/User');
const path = require('path');
const fs = require('fs');



const uploadProfileImage = async (req, res) => {
    console.log('Received file:', req.file);
  
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    try {
      const filePath = `/profile-images/${req.file.filename}`;
      console.log('File saved at:', filePath);
  
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.dp = filePath;
      await user.save();
  
      res.status(200).json({ message: 'Image uploaded successfully', profileImage: filePath });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };



  const getProfile = async (req, res) => {
    console.log("reached profile from db");
    try {
      const user = await User.findById(req.user.id);
      console.log("userrrrrrrr",user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);

    } catch (error) {
      console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  const deleteProfileImage = async (req, res) => {
    console.log("reached img-delete controller");
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.dp) {
        const filePath = path.join(__dirname, '..', 'public', user.dp);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
  
      user.dp = null;
      await user.save();
  
      res.status(200).json({ message: 'Profile image deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile image:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  


  
  const updateProfile = async (req, res) => {

    try {
      const userId = req.user.id; 

      const { name, email } = req.body;
  
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.name = name;
      user.email = email;

      await user.save();
  
      return res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  };



  module.exports = { uploadProfileImage, updateProfile, getProfile, deleteProfileImage };
