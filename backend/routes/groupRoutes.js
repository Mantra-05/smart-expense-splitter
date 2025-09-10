import express from "express";
import { createGroup, getGroups, getGroupById, deleteGroup, updateGroup } from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.post("/", protect, createGroup);
router.get("/", protect, getGroups);
router.get("/:id", protect, getGroupById);
router.delete("/:id", protect, deleteGroup);
router.put("/:id", protect, updateGroup);
export default router;
