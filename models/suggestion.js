// models/Suggestion.js
const pool = require("../config/db");

class Suggestion {
    static async create(prediction_id, suggestionText) {
        const result = await pool.query(
            `INSERT INTO suggestions (prediction_id, suggestion)
             VALUES ($1, $2)
             RETURNING *`,
            [prediction_id, suggestionText]
        );
        return result.rows[0];
    }

    static async findByPrediction(prediction_id) {
        const result = await pool.query(
            `SELECT * FROM suggestions WHERE prediction_id = $1`,
            [prediction_id]
        );
        return result.rows;
    }
}

module.exports = Suggestion;
