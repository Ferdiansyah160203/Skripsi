import express from "express";
import {
  createInventory,
  getAllInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "../controller/InventoriesController.js";

const router = express.Router();

router.post("/create", createInventory);
router.get("/", getAllInventories);
router.get("/:id", getInventoryById);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);

export default router;
