// controllers/predictController.js

const axios = require("axios");
const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const suggestionsData = require("../data.json");
const pool = require("../config/db");

exports.getPrediction = async (req, res) => {
    const { imageId } = req.params;

    try {
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found." });
        }

        const imageUrl = image.url;
        const mlResponse = await axios.post(process.env.ML_API_URL, {
            image_url: imageUrl,
        });

        const { disease, confidence } = mlResponse.data.prediction;
        const suggestion = suggestionsData.find(s => s.disease === disease);
        const explanation = suggestion ? suggestion.explanation : "No specific suggestion found.";

        const newPrediction = await Prediction.create(
            imageId,
            disease,
            confidence,
            explanation
        );

        res.status(200).json({
            success: true,
            message: "Prediction successful.",
            prediction: newPrediction,
            suggestion: {
                disease: disease,
                remedy: explanation,
            },
        });
    } catch (error) {
        console.error("❌ Error in getPrediction:", error.stack);
        res.status(500).json({
            success: false,
            message: "Prediction failed.",
            error: error.message
        });
    }
};

exports.getSavedPrediction = async (req, res) => {
    const { predictionId } = req.params;
    try {
        const prediction = await Prediction.findById(predictionId);
        if (!prediction) {
            return res.status(404).json({ success: false, message: "Prediction not found." });
        }

        res.status(200).json({
            success: true,
            prediction: prediction,
        });
    } catch (error) {
        console.error("❌ Error fetching saved prediction:", error.stack);
        res.status(500).json({
            success: false,
            message: "Failed to fetch saved prediction.",
            error: error.message
        });
    }
};