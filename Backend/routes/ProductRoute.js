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
import {
  cleanupOnError,
  logFileOperations,
} from "../middleware/fileMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  cleanupOnError,
  logFileOperations,
  createProduct
);
router.get("/available", getAvailableProducts);
router.get("/:id", getProductById);

router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  cleanupOnError,
  logFileOperations,
  updateProduct
);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
