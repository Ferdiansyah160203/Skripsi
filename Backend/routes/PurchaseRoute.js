import express from "express";
import {
  getAllPurchases,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
  getPurchaseStats,
} from "../controller/PurchaseController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

// Routes untuk Purchase
router.get("/", verifyToken, getAllPurchases);
router.get("/stats", verifyToken, getPurchaseStats);
router.get("/:id", verifyToken, getPurchaseById);
router.post("/", verifyToken, createPurchase);
router.put("/:id", verifyToken, updatePurchase);
router.delete("/:id", verifyToken, deletePurchase);

export default router;
