import express from "express";
import { cleanupFiles, getFileStats } from "../controller/FileController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get file statistics
router.get("/stats", verifyToken, getFileStats);

// Cleanup unused files
router.post("/cleanup", verifyToken, cleanupFiles);

export default router;
