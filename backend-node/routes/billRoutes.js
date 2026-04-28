const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");
const multer = require("multer");

// Configure multer for file uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Middleware to accept both 'image' and 'pdf' field names
const uploadMiddleware = (req, res, next) => {
  // Try to accept either 'image' or 'pdf' field
  const uploadAny = upload.any();
  uploadAny(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "File upload failed"
      });
    }

    // Ensure we have at least one file
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    // Move the file to req.file for compatibility with controller
    req.file = req.files[0];
    next();
  });
};

router.post("/", uploadMiddleware, billController.processBill);

module.exports = router;
