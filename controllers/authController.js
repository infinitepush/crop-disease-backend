const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied." });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid." });
    }
};

exports.signup = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists." });
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await User.create(fullname, email, passwordHash, phone);
        res.status(201).json({ success: true, message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Signup error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to create user." });
    }
};

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

exports.updateProfile = async (req, res) => {
    try {
        const { fullname, phone } = req.body;
        const userId = req.user.id;
        const updatedUser = await User.updateProfile(userId, { fullname, phone });
        res.status(200).json({ success: true, message: "Profile updated successfully.", user: updatedUser });
    } catch (error) {
        console.error("Update profile error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to update profile." });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await User.updatePassword(userId, passwordHash);
        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error.stack);
        res.status(500).json({ success: false, message: "Failed to change password." });
    }
};

exports.auth = auth;