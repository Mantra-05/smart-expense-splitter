import express from "express";
import { settleGroup, getSettlements } from "../controllers/settleController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Run settlement for a group (calculate + save)
router.post("/:groupId", protect, settleGroup);

// Get past settlement history for a group
router.get("/:groupId", protect, getSettlements);

export default router;
