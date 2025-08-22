// models/Image.js
const pool = require("../config/db");

class Image {
  static async create(url) {
    const result = await pool.query(
      "INSERT INTO images (url) VALUES ($1) RETURNING *",
      [url]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query("SELECT * FROM images WHERE id = $1", [id]);
    return result.rows[0];
  }
}

module.exports = Image;
