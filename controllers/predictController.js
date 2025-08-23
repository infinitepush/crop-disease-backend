// controllers/predictController.js
const axios = require("axios");
const Prediction = require("../models/Prediction");
const Image = require("../models/Image");
const Suggestion = require("../models/Suggestion"); // new model

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
        const imageUrl = imageRecord.url;

        // Mock ML response (later replace with real ML API call)
        const mlResponse = {
            data: {
                prediction: {
                    crop: "Sugarcane",
                    disease: "Bacterial Blight"
                },
                confidence: 0.3289335370063782,
                suggestions: "Provide adequate air circulation by spacing plants appropriately. Apply a copper-based fungicide. Remove and destroy severely infected plants."
            }
        };

        // Extract fields
        const { prediction, confidence, suggestions } = mlResponse.data;
        const { disease, crop } = prediction;

        // 1. Save prediction in DB
        const newPrediction = await Prediction.create(
            image_id,
            disease,
            confidence,
            crop // store crop name in explanation for now
        );

        // 2. Save suggestion linked to prediction
        const newSuggestion = await Suggestion.create(
            newPrediction.id,
            suggestions
        );

        res.status(200).json({
            success: true,
            message: "Prediction and suggestion saved.",
            prediction: newPrediction,
            suggestion: newSuggestion
        });

    } catch (error) {
        console.error("Error during prediction process:", error.stack);
        res.status(500).json({ success: false, message: "Prediction failed.", error: error.message });
    }
};
