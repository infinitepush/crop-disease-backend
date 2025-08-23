const express = require("express");
const {
  getPrediction,
  createPrediction,
  getPredictionWithSuggestion,
} = require("../controllers/predictController");

const router = express.Router();

// POST: Run prediction + store results
router.post("/", createPrediction);

// GET: Retrieve prediction + suggestion by image ID
router.get("/:imageId", getPredictionWithSuggestion);

// (Optional) keep your existing getPrediction if you still need it
router.post("/old", getPrediction);

module.exports = router;
