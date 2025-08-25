// controllers/predictController.js

const axios = require("axios"); // Import axios to make the API call
const Image = require("../models/Image");
const Prediction = require("../models/Prediction");
const suggestionsData = require("../data.json"); 

/**
 * Controller function to get a prediction for an uploaded image.
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

        // **Step 2: Make a real API call to your AI model**
        const mlResponse = await axios.post(process.env.ML_API_URL, {
            url: imageUrl,
        });

        // Step 3: Extract prediction data from the AI model's response
        // NOTE: You may need to adjust the structure below depending on the exact format of the ML API's response
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

/**
 * An alternative function to retrieve a previously saved prediction.
 */
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