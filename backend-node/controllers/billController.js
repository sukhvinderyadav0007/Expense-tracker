// Bill/Receipt Processing Controller
// Handles file uploads and mock OCR extraction

exports.processBill = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const file = req.file;
    const fileType = file.mimetype;

    // Validate file type
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'application/pdf'
    ];

    if (!allowedMimes.includes(fileType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid file type. Allowed: ${allowedMimes.join(', ')}`,
      });
    }

    console.log(`Processing file: ${file.originalname} (${fileType})`);

    // Mock OCR extraction (in production, use Tesseract.js or similar)
    // For now, return sample extracted data
    const mockExtractedData = {
      success: true,
      vendor: "Sample Store",
      total_amount: 125.50,
      currency: "INR",
      items: [
        { description: "Item 1", quantity: 2, price: 50.00 },
        { description: "Item 2", quantity: 1, price: 25.50 },
      ],
      date: new Date().toISOString().split('T')[0],
      manual_entry_required: false,
    };

    // Try to extract text from image (basic attempt)
    // In production, implement actual OCR using Tesseract.js
    if (fileType.includes('image')) {
      // For now, just confirm we received the image
      console.log(`Image received: ${file.size} bytes`);
    } else if (fileType === 'application/pdf') {
      console.log(`PDF received: ${file.size} bytes`);
    }

    return res.status(200).json(mockExtractedData);
  } catch (error) {
    console.error("Bill processing error:", error);
    res.status(500).json({
      success: false,
      error: `Error processing bill: ${error.message}`,
    });
  }
};
