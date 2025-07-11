import express from "express";
import {
  getDashboardSummary,
  getTopSellingProducts,
  getMonthlySales,
  getDailySales,
  getDashboardProducts,
  getDashboardStocks,
} from "../controller/DashboardController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/summary", verifyToken, getDashboardSummary);

router.get("/top-products", verifyToken, getTopSellingProducts);

router.get("/monthly-sales", verifyToken, getMonthlySales);

router.get("/daily-sales", verifyToken, getDailySales);

router.get("/products", verifyToken, getDashboardProducts);

router.get("/stocks", verifyToken, getDashboardStocks);

export default router;
