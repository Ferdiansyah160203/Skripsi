import {
  Register,
  login,
  UpdateUser,
  getAllUsers,
  getUserById,
  getUserByToken,
  deleteUser,
  updateUserRole,
  resetPassword,
} from "../controller/UserController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";

const router = express.Router();

router.post("/register", Register);
router.post("/login", login);
router.post("/token", refreshToken);
router.get("/all", getAllUsers);
router.put("/update/:id", verifyToken, UpdateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.put("/update-role/:id", verifyToken, updateUserRole);
router.put("/reset-password/:id", verifyToken, resetPassword);
router.get("/users/:id", verifyToken, getUserById);
router.get("/", verifyToken, getUserByToken);

export default router;
