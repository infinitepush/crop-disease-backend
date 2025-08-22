// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db"); // Import your database connection pool

const uploadRoutes = require("./routes/upload");
const predictRoutes = require("./routes/predict");
const feedbackRoutes = require("./routes/feedback");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "🌱 Crop Disease Backend is running 🚀" });
});

// Use the routes without the extra prefix
app.use("/upload", uploadRoutes);
app.use("/predict", predictRoutes);
app.use("/feedback", feedbackRoutes);

// Function to start the server after a successful database connection
const startServer = async () => {
    try {
        // Attempt to connect to the database by executing a simple query
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database');

        // Start the server only after a successful DB connection
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on port ${PORT}`);
        });
    } catch (error) {
        // Log the error and exit the process if the connection fails
        console.error('❌ Database connection failed:', error.stack);
        process.exit(1); 
    }
};

// Call the function to start the server
startServer();
