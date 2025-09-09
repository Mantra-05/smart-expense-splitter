import express from "express";
import { createExpense, getExpenses, getExpenseById } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All expense routes require authentication
router.post("/", protect, createExpense);
router.get("/", protect, getExpenses);
router.get("/:id", protect, getExpenseById);

export default router;
