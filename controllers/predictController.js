// controllers/predictController.js
const axios = require("axios");
// Import the specific models you need
const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const suggestionsData = require("../data.json"); // Assuming this file exists and contains your suggestions

/**
 * Controller function to get a prediction for an uploaded image.
 * This function expects an imageId from the route parameters.
 */
exports.getPrediction = async (req, res) => {
    // Extract the imageId from the URL parameter
    const { imageId } = req.params;

    try {
        // Step 1: Find the image in the database using its ID
        // This will give you access to the Cloudinary URL.
        const image = await db.images.findByPk(imageId);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found." });
        }

        const imageUrl = image.url; // Get the Cloudinary URL

        // Step 2: Make a real API call to your AI model
        // Replace 'YOUR_AI_MODEL_API_URL' with the actual endpoint.
        // The payload might need to be adjusted based on your model's requirements.
        const mlResponse = await axios.post("YOUR_AI_MODEL_API_URL", {
            image_url: imageUrl,
        });

        // Step 3: Extract prediction data from the AI model's response
        // This structure assumes your model returns a specific JSON format.
        const { disease, confidence } = mlResponse.data.prediction;

        // Step 4: Find the corresponding suggestion from your local data.json file
        const suggestion = suggestionsData.find(s => s.disease === disease);
        const explanation = suggestion ? suggestion.explanation : "No specific suggestion found.";

        // Step 5: Save the new prediction to the database
        const newPrediction = await db.predictions.create({
            image_id: imageId,
            disease: disease,
            confidence: confidence,
            explanation: explanation,
        });

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

/**
 * An alternative function to retrieve a previously saved prediction.
 * This is useful if a user wants to view a past result.
 */
exports.getSavedPrediction = async (req, res) => {
    const { predictionId } = req.params;
    try {
        const prediction = await db.predictions.findByPk(predictionId);
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