// routes/upload.js
const express = require('express');
const { uploadImage, uploadMiddleware } = require('../controllers/uploadController');
const router = express.Router();

// The path is changed from '/upload' to just '/'
router.post('/', uploadMiddleware, uploadImage);

module.exports = router;
