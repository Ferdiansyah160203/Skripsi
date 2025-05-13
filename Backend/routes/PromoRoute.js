import express from "express";
import {
  createPointPromo,
  getAllPointPromos,
  getPromoById,
  updatePointPromo,
  deletePointPromo,
} from "../controller/PromoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllPointPromos);
router.get("/:id", getPromoById);
router.post("/create", createPointPromo);
router.put("/:id", updatePointPromo);
router.delete("/:id", deletePointPromo);

export default router;
