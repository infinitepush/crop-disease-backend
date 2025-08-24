// routes/auth.js
const express = require('express');
const { signup, signin, getUserProfile, auth, changePassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', auth, getUserProfile);
router.post('/change-password', auth, changePassword);

// Add this new route to the file. We'll use a PUT method.
router.put('/profile', auth, updateProfile);

// And update the require statement at the top
// const { signup, signin, getUserProfile, changePassword, updateProfile, auth } = require('../controllers/authController');
module.exports = router;