// routes/history.js
const express = require('express');
const { getHistory } = require('../controllers/historyController');
const router = express.Router();

// The GET endpoint to retrieve the entire prediction history.
// The path should be '/' because '/history' is already defined in index.js.
router.get('/', getHistory);

module.exports = router;