require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const uploadRoutes = require("./routes/upload");
const predictRoutes = require("./routes/predict");
const feedbackRoutes = require("./routes/feedback");
const historyRoutes = require("./routes/history");
const authRoutes = require("./routes/auth");

const app = express(); // ✅ create app first
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' })); // ✅ now app exists
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
    res.json({ message: "🌱 Crop Disease Backend is running 🚀" });
});

// Use the routes
app.use("/upload", uploadRoutes);
app.use("/predict", predictRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/", historyRoutes);
app.use("/", authRoutes);

// Function to start the server after a successful database connection
const startServer = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database');
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.stack);
        process.exit(1);
    }
};

startServer();
