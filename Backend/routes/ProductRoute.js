import express from "express";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getAvailableProducts,
} from "../controller/ProductController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { upload } from "../middleware/UploadImage.js";

const router = express.Router();

router.post("/create", upload.single("image"), createProduct);
router.get("/", verifyToken, getAllProducts);

router.put("/:id", verifyToken, updateProduct);
router.get("/available", verifyToken, getAvailableProducts);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
