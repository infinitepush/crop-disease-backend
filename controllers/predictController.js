// controllers/predictController.js
const axios = require("axios");
const Prediction = require("../models/Prediction");
const Image = require("../models/Image"); 

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

        // Mock response that now includes a suggestions field
        const mlResponse = {
            data: {
                prediction: {
                    crop: "Sugarcane",
                    disease: "Bacterial Blight"
                },
                confidence: 0.3289335370063782,
                suggestions: "Provide adequate air circulation by spacing plants appropriately. Apply a copper-based fungicide to affected areas. Remove and destroy severely infected plants to prevent the spread of the disease."
            }
        };

        // Correctly destructure the nested prediction object
        const { prediction, confidence, suggestions } = mlResponse.data;
        const { disease, crop } = prediction;

        const newPrediction = await Prediction.create(
            image_id,
            disease,
            confidence,
            crop, // Saving crop in the explanation column
            suggestions
        );

        res.status(200).json({
            success: true,
            message: "Prediction successful and saved to database.",
            prediction: newPrediction
        });

    } catch (error) {
        console.error("Error during prediction process:", error.stack);
        res.status(500).json({ success: false, message: "Prediction failed.", error: error.message });
    }
};
