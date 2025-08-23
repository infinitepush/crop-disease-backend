// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For creating tokens

// IMPORTANT: Install these packages first:
// npm install bcrypt jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use an environment variable for a production app

// Handles user sign-up
exports.signup = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }

        // Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the new user in the database
        const newUser = await User.create(fullname, email, passwordHash, phone);

        res.status(201).json({ success: true, message: "User created successfully.", user: newUser });

    } catch (error) {
        console.error("Signup error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to create user." });
    }
};

// Handles user sign-in
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        
        // Create a JWT token for the user
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, message: "Signed in successfully.", token: token });

    } catch (error) {
        console.error("Signin error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to sign in." });
    }
};
