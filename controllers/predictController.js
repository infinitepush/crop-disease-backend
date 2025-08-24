const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const Suggestion = require("../models/Suggestion");
const fs = require("fs");

// Create prediction + suggestion from uploaded file
exports.createPrediction = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.userId;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image file is required." });
    }
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Save image record
    const newImage = await Image.create({
      filename: file.filename,
      originalName: file.originalname,
      userId: userId,
      path: file.path
    });

    // Mock ML API response
    const mlResponse = {
      data: {
        prediction: { crop: "Sugarcane", disease: "Bacterial Blight" },
        confidence: 0.83,
        suggestions: "Apply copper fungicide and remove infected plants."
      }
    };

    const { prediction, confidence, Suggestions } = mlResponse.data;
    const { disease, crop } = prediction;

    // Save prediction
    const newPrediction = await Prediction.create(
      newImage.id,
      disease,
      confidence,
      crop
    );

    // Save suggestion
    const newSuggestion = await Suggestion.create(newPrediction.id, Suggestions);

    // Optional: remove uploaded file after processing
    fs.unlinkSync(file.path);

    res.status(201).json({
      success: true,
      message: "Prediction and suggestion saved.",
      image: newImage,
      prediction: newPrediction,
      suggestion: newSuggestion
    });

  } catch (error) {
    console.error("❌ Error in createPrediction:", error);
    res.status(500).json({ success: false, message: "Prediction failed.", error: error.message });
  }
};
