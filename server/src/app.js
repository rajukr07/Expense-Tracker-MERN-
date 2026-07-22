const express = require("express");
const authRoutes = require("./routes/authRoutes");

const app = express();

// JSON middleware
app.use(express.json());

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running",
    environment: process.env.NODE_ENV,
  });
});

// Auth routes
app.use("/api/auth", authRoutes);

module.exports = app;