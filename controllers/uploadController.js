// controllers/uploadController.js
const cloudinary = require("../config/cloudinary");
// This is the standard and correct path. Please double-check
// that your 'models' and 'controllers' folder names are correct.
const Image = require("../models/Image");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure multer to use cloudinary as storage engine
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "crop-disease-images", // Folder in your Cloudinary account
        format: async (req, file) => 'png', // save all images as png
        public_id: (req, file) => Date.now() + '-' + file.originalname,
    },
});

const upload = multer({ storage: storage });

// Controller function for handling the image upload
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded." });
        }
        
        const imageUrl = req.file.path; // Multer saves the path on req.file.path

        // Save the image URL to your database using the Image model
        const newImage = await Image.create(imageUrl);

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            image: newImage // Return the newly created image record
        });
    } catch (error) {
        console.error("Error uploading image:", error.stack);
        res.status(500).json({ success: false, message: "Upload failed.", error: error.message });
    }
};

// Export the multer middleware so it can be used in your routes
exports.uploadMiddleware = upload.single("image");
