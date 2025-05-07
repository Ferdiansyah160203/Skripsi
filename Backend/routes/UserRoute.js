import {
  Register,
  login,
  UpdateUser,
  getAllUsers,
  getUserById,
  getUserByToken,
} from "../controller/UserController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";

const router = express.Router();

router.post("/register", Register);
router.post("/login", login);
router.post("/token", refreshToken);
router.put("/update/:id", verifyToken, UpdateUser);
router.get("/users/all", getAllUsers);
router.get("/users/:id", verifyToken, getUserById);
router.get("/", verifyToken, getUserByToken);

export default router;
