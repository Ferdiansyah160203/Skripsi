import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  deleteProduct,
  getAvailableProducts,
} from "../controller/ProductController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/UploadImage.js";

const router = express.Router();

router.post("/create", upload.single("image"), createProduct);
router.get("/", verifyToken, getAllProducts);
router.get("/products/:id", verifyToken, getProductById);

router.put("/:id", verifyToken, updateProduct);
router.get("/available", verifyToken, getAvailableProducts);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
