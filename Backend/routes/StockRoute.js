import express from "express";
import {
  createMultipleStockOpname,
  getStockOpnameSessions,
  getStockOpnameBySession,
  downloadStockOpnamePDF,
} from "../controller/StockOpnameController.js";

const router = express.Router();

router.get("/session/:session_id", getStockOpnameBySession);
router.get("/", getStockOpnameSessions);
router.post("/create-multiple", createMultipleStockOpname);
router.get("/download/:session_id", downloadStockOpnamePDF);

export default router;
