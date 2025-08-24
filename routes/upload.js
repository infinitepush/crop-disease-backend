const express = require('express');
const { uploadImage, uploadMiddleware } = require('../controllers/uploadController');
const { auth } = require('../controllers/authController'); // Import the auth middleware
const router = express.Router();

// The upload route now requires a valid JWT token
router.post('/', auth, uploadMiddleware, uploadImage);

module.exports = router;