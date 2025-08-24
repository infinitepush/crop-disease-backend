// routes/predict.js
const express = require("express");
// Import the corrected getPrediction and getSavedPrediction controllers
const { getPrediction, getSavedPrediction } = require("../controllers/predictController");

const router = express.Router();

// This route is for getting a new prediction from the AI model
// The image ID is received from a prior upload
// Example: POST /api/predict/123
router.post("/:imageId", getPrediction);

// This is an optional route for fetching a previously saved prediction
// Example: GET /api/predict/saved/123
router.get("/saved/:predictionId", getSavedPrediction);

module.exports = router;