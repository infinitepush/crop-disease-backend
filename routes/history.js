// routes/history.js
const express = require('express');
const { getHistory } = require('../controllers/historyController');
const router = express.Router();

// The GET endpoint to retrieve the entire prediction history
router.get('/history', getHistory);

module.exports = router;
