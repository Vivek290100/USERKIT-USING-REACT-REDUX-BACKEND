// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};





const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log('login received:', req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    console.log('Signup request received:', req.body);

    let user;
    try {
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    } catch (error) {
      console.error('Error querying user:', error.message);
      return res.status(500).json({ message: 'Database query error' });
    }
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    user = new User({
      name,
      email,
      password: hashedPassword, 
      role: 'user', 
    });


    await user.save();


    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};


module.exports = { login, signup};
