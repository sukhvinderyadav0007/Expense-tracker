const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const expenseRoutes = require("./routes/expenseRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const billRoutes = require("./routes/billRoutes");

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Expense API routes
app.use("/api/expenses", expenseRoutes);

// Analytics API routes
app.use("/api/analytics", analyticsRoutes);

// Bill Processing routes
app.use("/api/process-bill", billRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  Smart Expense Tracker Backend Running  ║
║  Port: ${PORT}                            ║
║  URL: http://localhost:${PORT}           ║
║  API: http://localhost:${PORT}/api/expenses║
╚════════════════════════════════════════╝
  `);
});
