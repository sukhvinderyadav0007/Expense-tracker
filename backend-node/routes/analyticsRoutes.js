const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Routes
router.get("/", analyticsController.getAnalytics);

module.exports = router;
