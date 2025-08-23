const pool = require("../db");

// Insert image
async function insertImage(url) {
  const result = await pool.query(
    `INSERT INTO images (url) VALUES ($1) RETURNING id`,
    [url]
  );
  return result.rows[0].id;
}

// Insert prediction
async function insertPrediction(imageId, disease, confidence, explanation) {
  const result = await pool.query(
    `INSERT INTO predictions (image_id, disease, confidence, explanation)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [imageId, disease, confidence, explanation]
  );
  return result.rows[0].id;
}

// Insert suggestion
async function insertSuggestion(predictionId, suggestion) {
  const result = await pool.query(
    `INSERT INTO suggestions (prediction_id, suggestion)
     VALUES ($1, $2) RETURNING id`,
    [predictionId, suggestion]
  );
  return result.rows[0].id;
}

// Get prediction + suggestion for an image
async function getPredictionWithSuggestion(imageId) {
  const result = await pool.query(
    `SELECT 
        i.id AS image_id,
        i.url AS image_url,
        p.id AS prediction_id,
        p.disease,
        p.confidence,
        p.explanation,
        s.id AS suggestion_id,
        s.suggestion,
        s.accepted
     FROM predictions p
     JOIN images i ON p.image_id = i.id
     LEFT JOIN suggestions s ON s.prediction_id = p.id
     WHERE i.id = $1`,
    [imageId]
  );
  return result.rows;
}

module.exports = {
  insertImage,
  insertPrediction,
  insertSuggestion,
  getPredictionWithSuggestion,
};
