import express from "express";
import {
  createMember,
  getAllMembers,
  getMemberByIdentifier,
  getMemberById,
  updateMember,
  deleteMember,
} from "../controller/MemberController.js";

const router = express.Router();

router.post("/create", createMember);
router.get("/", getAllMembers);
router.get("/:identifier", getMemberByIdentifier);
router.get("/list/:id", getMemberById);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
