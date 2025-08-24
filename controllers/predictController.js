// controllers/predictController.js

const axios = require("axios"); // Used to make a real API call to your AI model
const Image = require("../models/Image"); // Import the specific Image model
const Prediction = require("../models/Prediction"); // Import the specific Prediction model
const suggestionsData = require("../data.json"); // Assuming this file exists and contains your suggestions
const pool = require("../config/db"); // You need this to run custom queries

/**
 * Controller function to get a prediction for an uploaded image.
 * This function expects an imageId from the route parameters.
 */
exports.getPrediction = async (req, res) => {
    const { imageId } = req.params;

    try {
        // Step 1: Find the image in the database using its ID
        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found." });
        }

        const imageUrl = image.url; // Get the Cloudinary URL

        // Step 2: Make a real API call to your AI model
        const mlResponse = await axios.post(process.env.ML_API_URL, {
            image_url: imageUrl,
        });

        // Step 3: Extract prediction data from the AI model's response
        const { disease, confidence } = mlResponse.data.prediction;

        // Step 4: Find the corresponding suggestion from your local data.json file
        const suggestion = suggestionsData.find(s => s.disease === disease);
        const explanation = suggestion ? suggestion.explanation : "No specific suggestion found.";

        // Step 5: Save the new prediction to the database
        const newPrediction = await Prediction.create(
            imageId, 
            disease, 
            confidence, 
            explanation
        );

        // Step 6: Respond with the prediction and its suggestion
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
        // Handle all errors gracefully
        console.error("❌ Error in getPrediction:", error.stack);
        res.status(500).json({ 
            success: false, 
            message: "Prediction failed.", 
            error: error.message 
        });
    }
};
