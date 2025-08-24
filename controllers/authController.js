// controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Handles user sign-up
exports.signup = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // **CORRECTED:** Pass the data as individual arguments to the User.create method.
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
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password." });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ success: true, message: "Signed in successfully.", token: token });
    } catch (error) {
        console.error("Signin error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to sign in." });
    }
};

// Add this new function to your authController.js file

// Middleware to protect routes
const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add user payload to the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid." });
    }
};

// Handles fetching a user's profile
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({
            success: true,
            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone
            }
        });
    } catch (error) {
        console.error("Profile fetch error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to fetch user profile." });
    }
};

// Add this new function to the file
exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id; // User ID from the JWT token

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        
        await User.updatePassword(userId, passwordHash);

        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to change password." });
    }
};

// Update the exports at the bottom
// exports.signin = signin;
// exports.auth = auth;
// exports.getUserProfile = getUserProfile;
// exports.changePassword = changePassword;
// Don't forget to export the auth middleware as well
exports.auth = auth;