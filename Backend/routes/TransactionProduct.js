import express from "express";
import {
  createStockOpname,
  getAllStockOpname,
} from "../controller/StockOpnameController";

export const router = express.Router();

router.post("/create", createStockOpname);
router.get("/", getAllStockOpname);

export default router;
