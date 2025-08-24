// routes/auth.js
const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;

// Add this new route to your auth.js file

// Get user profile (protected route)
router.get('/profile', auth, getUserProfile);

// Make sure to add getUserProfile to the destructuring at the top
// For example:
// const { signup, signin, getUserProfile, auth } = require('../controllers/authController');