import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create new expense
router.post("/", protect, createExpense);

// Get all expenses for logged-in user
router.get("/", protect, getExpenses);

// Get single expense by ID
router.get("/:id", protect, getExpenseById);

// Update expense
router.put("/:id", protect, updateExpense);

// Delete expense
router.delete("/:id", protect, deleteExpense);

export default router;
