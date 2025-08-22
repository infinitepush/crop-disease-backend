// models/Prediction.js
const pool = require("../config/db");

class Prediction {
  static async create(image_id, disease, confidence, explanation) {
    const result = await pool.query(
      "INSERT INTO predictions (image_id, disease, confidence, explanation) VALUES ($1, $2, $3, $4) RETURNING *",
      [image_id, disease, confidence, explanation]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM predictions WHERE id = $1", [id]);
    return result.rows[0];
  }
}

module.exports = Prediction;