// models/Suggestion.js
const pool = require("../config/db");

class Suggestion {
    // Create a new suggestion linked to a prediction
    static async create(prediction_id, suggestion) {
        const result = await pool.query(
            `INSERT INTO suggestions (prediction_id, suggestion)
             VALUES ($1, $2)
             RETURNING *`,
            [prediction_id, Suggestion]
        );
        return result.rows[0];
    }

    // Find all suggestions for a given prediction
    static async findByPrediction(prediction_id) {
        const result = await pool.query(
            `SELECT * FROM suggestions WHERE prediction_id = $1`,
            [prediction_id]
        );
        return result.rows;
    }

    // Update suggestion status (accepted/rejected)
    static async updateStatus(id, accepted) {
        const result = await pool.query(
            `UPDATE suggestions SET accepted = $1 WHERE id = $2 RETURNING *`,
            [accepted, id]
        );
        return result.rows[0];
    }
}

module.exports = Suggestion;
