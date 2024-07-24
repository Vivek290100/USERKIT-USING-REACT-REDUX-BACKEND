// controllers/adminController.js
const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt')

const getUsers = async (req, res) => {
  console.log('getUsers controller called');
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    console.log("users found:", users.length);
    res.json(users);
  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


const deleteUser = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.dp && user.dp !== 'def_prof.jpg') {
      const imagePath = path.join(__dirname, '../public/profile-images', user.dp);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err);
      });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserByAdmin = async (req, res) => {
  console.log("reach here admin edit");
  const { userId } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name;
    user.email = email;
    await user.save();

    return res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user by admin:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};




const addUser = async (req, res) => {
  console.log("reached add user controller");
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    await newUser.save();

    const userWithoutPassword = { ...newUser.toObject() };
    delete userWithoutPassword.password;

    return res.status(201).json({ message: 'User added successfully', user: userWithoutPassword });
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUsers, deleteUser, updateUserByAdmin, addUser };
