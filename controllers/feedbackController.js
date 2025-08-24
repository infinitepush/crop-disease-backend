// controllers/feedbackController.js
const Feedback = require("../models/Feedback");

// Controller function for saving user feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { prediction_id, is_correct, notes } = req.body;

        // Validate the required fields
        if (!prediction_id || typeof is_correct === 'undefined') {
            return res.status(400).json({ success: false, message: "Prediction ID and is_correct status are required." });
        }

        // **FIX:** Parse prediction_id to integer and pass all arguments individually.
        const parsedPredictionId = parseInt(prediction_id, 10);
        
        if (isNaN(parsedPredictionId)) {
            return res.status(400).json({ success: false, message: "Prediction ID must be a number." });
        }

        const newFeedback = await Feedback.create(parsedPredictionId, is_correct, notes);

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully.",
            feedback: newFeedback
        });
    } catch (error) {
        console.error("Error submitting feedback:", error.stack);
        res.status(500).json({ success: false, message: "Failed to submit feedback.", error: error.message });
    }
};