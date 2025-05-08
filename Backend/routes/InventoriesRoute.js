import express from "express";
import {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controller/InventoriesController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", createInventory);
router.get("/", verifyToken, getAllInventories);
router.get("/:id", verifyToken, getInventoryById);
router.put("/:id", verifyToken, updateInventory);
router.delete("/:id", verifyToken, deleteInventory);

export default router;
