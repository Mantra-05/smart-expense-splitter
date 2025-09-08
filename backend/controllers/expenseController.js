import Expense from "../models/Expense.js";

// @desc    Create a new expense
// @route   POST /api/expenses
export const createExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, participants } = req.body;

    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all expenses
// @route   GET /api/expenses
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("paidBy").populate("participants");
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("paidBy participants");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
