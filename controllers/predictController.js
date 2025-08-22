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

        // Fetch the image URL from your database using the ID.
        const imageRecord = await Image.findById(image_id);
        if (!imageRecord) {
            return res.status(404).json({ success: false, message: "Image not found." });
        }
        const imageUrl = imageRecord.url;

        // Make the API call to Shubham's ML model
        // We will send the image URL in the body.
        const mlResponse = await axios.post(
            process.env.ML_API_URL, 
            { imageUrl: imageUrl } // Send the URL in a JSON body
        );

        // Extract the data from the response based on the ML model's output
        const { disease, confidence, explanation } = mlResponse.data;

        // Save the actual prediction result to your database
        const newPrediction = await Prediction.create(
            image_id,
            disease,
            confidence,
            explanation
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
