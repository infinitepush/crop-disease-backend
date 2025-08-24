// controllers/historyController.js
const pool = require("../config/db");

// Controller function to fetch all predictions and their image URLs
exports.getHistory = async (req, res) => {
    let client;
    try {
        // Acquire a client from the pool
        client = await pool.connect();
        
        // Query the database to get all predictions and their related image URLs.
        const query = `
            SELECT 
                p.id, 
                p.image_id, 
                p.disease, 
                p.confidence, 
                p.explanation,
                p.created_at,
                i.url AS image_url
            FROM predictions p
            JOIN images i ON p.image_id = i.id
            ORDER BY p.created_at DESC;
        `;
        
        const result = await client.query(query);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "No history found." });
        }
        
        res.status(200).json({ success: true, predictions: result.rows });

    } catch (error) {
        console.error("Error fetching history:", error.stack);
        res.status(500).json({ success: false, message: "Failed to fetch history." });
    } finally {
        // Ensure the client is released back to the pool
        if (client) {
            client.release();
        }
    }
};