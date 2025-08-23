// controllers/predictController.js
const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const Suggestion = require("../models/Suggestion");

// 1️⃣ Create new prediction + suggestion
exports.createPrediction = async (req, res) => {
  try {
    const { image_id } = req.body;

    if (!image_id) {
      return res.status(400).json({ success: false, message: "Image ID is required." });
    }

    const imageRecord = await Image.findById(image_id);
    if (!imageRecord) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    // Mock ML API response (replace later with real API)
    const mlResponse = {
      data: {
        prediction: { crop: "Sugarcane", disease: "Bacterial Blight" },
        confidence: 0.83,
        suggestions: "Apply copper fungicide and remove infected plants."
      }
    };

    const { prediction, confidence, suggestions } = mlResponse.data;
    const { disease, crop } = prediction;

    // Save prediction
    const newPrediction = await Prediction.create(
      image_id,
      disease,
      confidence,
      crop // stored in explanation
    );

    // Save suggestion
    const newSuggestion = await Suggestion.create(newPrediction.id, suggestions);

    res.status(201).json({
      success: true,
      message: "Prediction and suggestion saved.",
      prediction: newPrediction,
      suggestion: newSuggestion
    });

  } catch (error) {
    console.error("❌ Error in createPrediction:", error);
    res.status(500).json({ success: false, message: "Prediction failed.", error: error.message });
  }
};

// 2️⃣ Get prediction + suggestion by imageId
exports.getPredictionWithSuggestion = async (req, res) => {
  try {
    const { imageId } = req.params;

    const prediction = await Prediction.findById(imageId);
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    const suggestion = await Suggestion.findByPredictionId(prediction.id);

    res.json({
      success: true,
      prediction,
      suggestion
    });

  } catch (error) {
    console.error("❌ Error in getPredictionWithSuggestion:", error);
    res.status(500).json({ success: false, message: "Failed to fetch prediction.", error: error.message });
  }
};

// 3️⃣ Old getPrediction (basic, without suggestion)
exports.getPrediction = async (req, res) => {
  try {
    const { image_id } = req.body;

    if (!image_id) {
      return res.status(400).json({ success: false, message: "Image ID is required." });
    }

    const prediction = await Prediction.findById(image_id);
    if (!prediction) {
      return res.status(404).json({ success: false, message: "Prediction not found." });
    }

    res.json({
      success: true,
      prediction
    });

  } catch (error) {
    console.error("❌ Error in getPrediction:", error);
    res.status(500).json({ success: false, message: "Failed to fetch prediction.", error: error.message });
  }
};
