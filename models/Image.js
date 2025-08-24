// models/Image.js
const pool = require("../config/db");

class Image {
  static async create(url) {
    const result = await pool.query(
      "INSERT INTO images (url) VALUES ($1) RETURNING *",
      [url] // Ensure this is just the string, not a JSON object
    );
    return result.rows[0];
  }

  // ... rest of the file
}

module.exports = Image;