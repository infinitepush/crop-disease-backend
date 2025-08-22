// routes/feedback.js
const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const router = express.Router();

// The path is changed from '/feedback' to just '/'
router.post('/', submitFeedback);

module.exports = router;
