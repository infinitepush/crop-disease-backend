// Import necessary modules
const cloudinary = require("../config/cloudinary");
const Image = require("../models/Image");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "crop-disease-images", // Your Cloudinary folder name
        format: async (req, file) => 'png', // Save all images as PNG
        public_id: (req, file) => Date.now() + '-' + file.originalname, // Unique public ID
    },
});

const upload = multer({ storage: storage });

/**
 * Controller function to handle image uploads.
 * This function runs after the multer middleware processes the file.
 */
exports.uploadImage = async (req, res) => {
    try {
        // Check if a file was successfully uploaded by multer
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file uploaded." });
        }
        
        // The Cloudinary URL is available on req.file.path after multer completes
        const imageUrl = req.file.path;

        // **CORRECTED LINE:** Pass the URL as a plain string.
        const newImage = await Image.create(imageUrl);

        // Respond with a success message and the newly created image record
        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            image: newImage
        });
    } catch (error) {
        // Handle any errors that occur during the upload or database save
        console.error("Error uploading image:", error.stack);
        res.status(500).json({ 
            success: false, 
            message: "Upload failed.", 
            error: error.message 
        });
    }
};

// Export the multer middleware to be used in your Express routes
exports.uploadMiddleware = upload.single("image");