import express from "express";
import {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
  reduceInventoryStock,
  addInventoryStock,
} from "../controller/InventoriesController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", createInventory);
router.get("/", verifyToken, getAllInventories);
router.get("/:id", verifyToken, getInventoryById);
router.put("/:id", verifyToken, updateInventory);
router.delete("/:id", verifyToken, deleteInventory);
router.put("/:id/reduce", verifyToken, reduceInventoryStock);
router.put("/:id/add", verifyToken, addInventoryStock);

export default router;
