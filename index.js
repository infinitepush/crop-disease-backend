// index.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Import all route files
const uploadRoutes = require("./routes/upload");
const predictRoutes = require("./routes/predict");
const feedbackRoutes = require("./routes/feedback");
const historyRoutes = require("./routes/history");
const authRoutes = require("./routes/auth");
const pool = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
    res.json({ message: "🌱 Crop Disease Backend is running 🚀" });
});

// Routes with consistent pathing
app.use("/upload", uploadRoutes);
app.use("/predict", predictRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/history", historyRoutes);
app.use("/auth", authRoutes);

// Start server after DB connection
const startServer = async () => {
    try {
        await pool.query("SELECT NOW()"); // A simple query to check the connection
        console.log("✅ Database connection successful.");
        app.listen(PORT, () => {
            console.log(`🚀 Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Database connection failed:", error.stack);
        process.exit(1);
    }
};

startServer();