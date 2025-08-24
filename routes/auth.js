// routes/auth.js
const express = require('express');
const { signup, signin, getUserProfile, auth, changePassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/profile', auth, getUserProfile);
router.post('/change-password', auth, changePassword);

module.exports = router;