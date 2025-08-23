// controllers/predictController.js
const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const Suggestion = require("../models/Suggestion");

exports.getPrediction = async (req, res) => {
    try {
        const { image_id } = req.body;

        if (!image_id) {
            return res.status(400).json({ success: false, message: "Image ID is required." });
        }

        const imageRecord = await Image.findById(image_id);
        if (!imageRecord) {
            return res.status(404).json({ success: false, message: "Image not found." });
        }

        // Mock ML API response (later replace with real API)
        const mlResponse = {
            data: {
                prediction: { crop: "Sugarcane", disease: "Bacterial Blight" },
                confidence: 0.83,
                suggestions: "Apply copper fungicide and remove infected plants."
            }
        };

        const { prediction, confidence, suggestions } = mlResponse.data;
        const { disease, crop } = prediction;

        // 1️⃣ Save prediction
        const newPrediction = await Prediction.create(
            image_id,
            disease,
            confidence,
            crop // stored in explanation
        );

        // 2️⃣ Save suggestion
        const newSuggestion = await Suggestion.create(newPrediction.id, suggestions);

        res.status(201).json({
            success: true,
            message: "Prediction and suggestion saved.",
            prediction: newPrediction,
            suggestion: newSuggestion
        });

    } catch (error) {
        console.error("❌ Error in prediction:", error);
        res.status(500).json({ success: false, message: "Prediction failed.", error: error.message });
    }
};
