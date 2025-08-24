// routes/predict.js
const express = require("express");
const multer = require("multer");
const {
  getPrediction,
  createPrediction,
  getPredictionWithSuggestion,
} = require("../controllers/predictController");

const router = express.Router();

// Multer config for file uploads
const upload = multer({ dest: "uploads/" }); // temporary folder

// POST: Run prediction + store results (frontend calls /predict-back)
router.post("/predict-back", upload.single("file"), createPrediction);

// GET: Retrieve prediction + suggestion by image ID
router.get("/:imageId", getPredictionWithSuggestion);

// Optional old prediction route
router.post("/old", getPrediction);

module.exports = router;
