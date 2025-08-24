// routes/auth.js
const express = require('express');
const { signup, signin, getUserProfile, auth } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

// Get user profile (protected route)
router.get('/profile', auth, getUserProfile);

module.exports = router;