import express from "express";
import {
  createTransaction,
  updateTransaction,
  getTransactionById,
  getAllTransactions,
  markAsPaid,
} from "../controller/TransactionController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.put("/:id", updateTransaction);
router.get("/:id", getTransactionById);
router.get("/", getAllTransactions);
router.put(":id/mark-as-paid/", markAsPaid);

export default router;
