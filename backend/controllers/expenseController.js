import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, participants, category, group, notes } = req.body;

    if (!description || !amount || !paidBy || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      participants,
      category,
      group,
      notes,
      createdBy: req.user._id,
    });

    // If group is provided → link this expense to group
    if (group) {
      const grp = await Group.findById(group);
      if (grp) {
        grp.expenses.push(expense._id);
        await grp.save();
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all expenses (user-specific)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ "participants.user": req.user._id })
      .populate("paidBy", "name email")
      .populate("participants.user", "name email")
      .populate("group", "name");

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("paidBy", "name email")
      .populate("participants.user", "name email")
      .populate("group", "name");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Authorization: user must be participant or payer
    const isAuthorized =
      expense.paidBy._id.equals(req.user._id) ||
      expense.participants.some(p => p.user._id.equals(req.user._id));

    if (!isAuthorized) {
      return res.status(403).json({ message: "Not authorized to view this expense" });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  try {
    const { description, amount, participants, category, notes } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only creator or payer can update
    if (!expense.createdBy.equals(req.user._id) && !expense.paidBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    if (description) expense.description = description;
    if (amount) expense.amount = amount;
    if (participants) expense.participants = participants;
    if (category) expense.category = category;
    if (notes) expense.notes = notes;

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only creator or payer can delete
    if (!expense.createdBy.equals(req.user._id) && !expense.paidBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }

    await expense.deleteOne();

    // Remove from group.expenses if linked
    if (expense.group) {
      const grp = await Group.findById(expense.group);
      if (grp) {
        grp.expenses = grp.expenses.filter(e => !e.equals(expense._id));
        await grp.save();
      }
    }

    res.json({ message: "Expense removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;
    const expenses = await Expense.find({ group: groupId }).populate("paidBy participants.user");
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching group expenses" });
  }
};
