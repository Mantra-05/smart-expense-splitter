import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// routes after middleware
app.use("/api/users", userRoutes);
app.use("/api/expenses",expenseRoutes);
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
