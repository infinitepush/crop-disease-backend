const express = require("express");
const multer = require("multer");

router.post("/predict-back", upload.single("file"), createPrediction);

const {
  getPrediction,
  createPrediction,
  getPredictionWithSuggestion,
} = require("../controllers/predictController");

const router = express.Router();

// Multer config for file uploads
const upload = multer({ dest: "uploads/" }); // temporary folder for uploaded images

// POST: Run prediction + store results (matches frontend /predict-back)
router.post("/predict-back", upload.single("file"), createPrediction);

// GET: Retrieve prediction + suggestion by image ID
router.get("/:imageId", getPredictionWithSuggestion);

// Optional old prediction route
router.post("/old", getPrediction);

module.exports = router;
