// models/Prediction.js
const pool = require("../config/db");

class Prediction {
    // Create a new prediction
    static async create(image_id, disease, confidence, explanation = null) {
        const result = await pool.query(
            `INSERT INTO predictions (image_id, disease, confidence, explanation)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [image_id, disease, confidence, explanation]
        );
        return result.rows[0];
    }

    // Get a prediction by ID (with suggestions if needed)
    static async findById(id) {
        const result = await pool.query(
            `SELECT p.*, s.suggestion, s.accepted
             FROM predictions p
             LEFT JOIN suggestions s ON s.prediction_id = p.id
             WHERE p.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    // Get all predictions for an image
    static async findByImage(image_id) {
        const result = await pool.query(
            `SELECT * FROM predictions WHERE image_id = $1 ORDER BY created_at DESC`,
            [image_id]
        );
        return result.rows;
    }
}

module.exports = Prediction;
