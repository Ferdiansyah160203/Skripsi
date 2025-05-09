import express from "express";
import {
  createPointPromo,
  getAllPointPromos,
  updatePointPromo,
  deletePointPromo,
} from "../controller/PromoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllPointPromos);
router.post("/create", createPointPromo);
router.put("/promos/:id", updatePointPromo);
router.delete("/promos/:id", deletePointPromo);

export default router;
