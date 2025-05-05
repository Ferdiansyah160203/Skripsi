import {
  Register,
  login,
  UpdateUser,
  getAllUsers,
} from "../controller/UserController.js";
import { refreshToken } from "../controller/RefreshToken.js";
import express from "express";

const router = express.Router();

router.post("/register", Register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.put("/update/:id", UpdateUser);
router.get("/users", getAllUsers);

export default router;
