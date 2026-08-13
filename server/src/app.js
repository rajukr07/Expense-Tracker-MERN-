const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// CORS

  app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-tracker-mern-iyfq.vercel.app",
    ],
    credentials: true,
  })
);
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

module.exports = app;