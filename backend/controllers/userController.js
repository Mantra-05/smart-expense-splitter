import User from "../models/User.js";

// @desc    Create a new user
// @route   POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = new User({ name, email });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
