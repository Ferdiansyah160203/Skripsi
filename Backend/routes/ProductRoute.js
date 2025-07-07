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

router.get("/", getAllProducts);
router.post("/create", verifyToken, upload.single("image"), createProduct);
router.get("/available", getAvailableProducts);
router.get("/:id", getProductById);

router.put("/:id", verifyToken, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
