import Group from "../models/Group.js";
import User from "../models/User.js";

// @desc    Create new group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Group name is required" });
    }

    // Ensure creator is always included in members
    const allMembers = members
  ? [...new Set([...members.map(m => m.toString()), req.user._id.toString()])]
  : [req.user._id.toString()];

    const group = await Group.create({
      name,
      description,
      members: allMembers,
      createdBy: req.user._id,
    });

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all groups of logged-in user
// @route   GET /api/groups
// @access  Private
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email")
      .populate("expenses");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Ensure user is part of group
    if (!group.members.some(m => m._id.equals(req.user._id))) {
      return res.status(403).json({ message: "Not authorized to view this group" });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete group
// @route   DELETE /api/groups/:id
// @access  Private
export const deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete
    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only creator can delete this group" });
    }

    await group.deleteOne();
    res.json({ message: "Group removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update group (name, description, members)
// @route   PUT /api/groups/:id
// @access  Private
export const updateGroup = async (req, res) => {
  try {
    const { name, description, addMembers, removeMembers } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can update group details
    if (!group.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only creator can update this group" });
    }

    // Update basic info
    if (name) group.name = name;
    if (description) group.description = description;

    // Add members
    if (addMembers && addMembers.length > 0) {
      const currentMembers = group.members.map(m => m.toString());
      const newMembers = addMembers.map(m => m.toString());
      group.members = [...new Set([...currentMembers, ...newMembers])];
    }

    // Remove members
    if (removeMembers && removeMembers.length > 0) {
      const removeSet = new Set(removeMembers.map(m => m.toString()));
      group.members = group.members.filter(
        m => !removeSet.has(m.toString())
      );
    }

    await group.save();

    const updatedGroup = await Group.findById(req.params.id)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

