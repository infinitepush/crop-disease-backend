// Import necessary modules
const cloudinary = require("../config/cloudinary");
// The path to your Image model, assuming it's a Mongoose or Sequelize model.
// The `models` directory is one level up from `controllers`.
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

        // **FIX:** The `create` method expects an object with the data.
        // Your `images` table has a 'url' column, so pass the URL in an object.
        const newImage = await Image.create({ url: imageUrl });

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
// e.g., router.post('/upload', uploadController.uploadMiddleware, uploadController.uploadImage);
exports.uploadMiddleware = upload.single("image");