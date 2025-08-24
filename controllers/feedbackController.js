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

        // **FIX:** Pass the data as a single object to the create method.
        // The keys in the object should match the column names in your 'feedback' table.
        const newFeedback = await Feedback.create({
            prediction_id: prediction_id,
            is_correct: is_correct,
            notes: notes
        });

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