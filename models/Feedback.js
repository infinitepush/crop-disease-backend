// models/Feedback.js
const pool = require("../config/db");

class Feedback {
  static async create(prediction_id, is_correct, notes) {
    const result = await pool.query(
      "INSERT INTO feedback (prediction_id, is_correct, notes) VALUES ($1, $2, $3) RETURNING *",
      [prediction_id, is_correct, notes]
    );
    return result.rows[0];
  }
}

module.exports = Feedback;
