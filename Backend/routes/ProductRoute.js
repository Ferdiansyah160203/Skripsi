import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAvailableProducts,
} from "../controller/ProductController.js";

const router = express.Router();

router.post("/create", createProduct);
router.get("/", getAllProducts);

router.put("/:id", updateProduct);
router.get("/available", getAvailableProducts);
router.delete("/:id", deleteProduct);

export default router;
