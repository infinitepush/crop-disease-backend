// routes/predict.js
const express = require('express');
const { getPrediction } = require('../controllers/predictController');
const router = express.Router();

// The path is changed from '/predict' to just '/'
router.post('/', getPrediction);

module.exports = router;
