import express from "express";
import {
  createPointPromo,
  getAllPointPromos,
  updatePointPromo,
  deletePointPromo,
} from "../controllers/PointPromoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/promos", getAllPointPromos);
router.post("/promos", createPointPromo);
router.put("/promos/:id", updatePointPromo);
router.delete("/promos/:id", deletePointPromo);

export default router;
