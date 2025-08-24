// routes/auth.js
const express = require('express');
const { signup, signin, getUserProfile, auth } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

// Get user profile (protected route)
router.get('/profile', auth, getUserProfile);

// Add this new line to the file
router.post('/change-password', auth, changePassword);

// Update the require statement to include the new function
// const { signup, signin, getUserProfile, changePassword, auth } = require('../controllers/authController');
module.exports = router;