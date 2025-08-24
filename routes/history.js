const express = require('express');
const { getHistory } = require('../controllers/historyController');
const { auth } = require('../controllers/authController'); // Import the auth middleware
const router = express.Router();

// The history route now requires a valid JWT token
router.get('/', auth, getHistory);

module.exports = router;