import express from "express";
import {
  createMember,
  getAllMembers,
  getMemberByIdentifier,
} from "../controller/MemberController.js";

const router = express.Router();

router.post("/create", createMember);
router.get("/", getAllMembers);
router.get("/:identifier", getMemberByIdentifier);

export default router;
