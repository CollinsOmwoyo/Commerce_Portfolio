const express = require("express");
const path = require("path");
const multer = require("multer");

const router = express.Router();

// Set up storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images")); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

// File filter for image uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Upload middleware
const upload = multer({ storage, fileFilter });

// Serve static product images
router.use("/products", express.static(path.join(__dirname, "../public/images/products")));

// Upload a new product image
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No image uploaded" });
  }
  res.json({ message: "Image uploaded successfully", filename: req.file.filename });
});

// Retrieve a specific image
router.get("/:filename", (req, res) => {
  const imagePath = path.join(__dirname, "../public/images", req.params.filename);
  res.sendFile(imagePath);
});

module.exports = router;
