import express from "express";
import { cleanupFiles, getFileStats } from "../controller/FileController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();

router.get("/stats", verifyToken, getFileStats);

router.post("/cleanup", verifyToken, cleanupFiles);

export default router;
