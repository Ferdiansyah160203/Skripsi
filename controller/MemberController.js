import Member from "../models/MemberModel.js";
import { Op } from "sequelize";

export const createMember = async (req, res) => {
  const { name, phone, email } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Cek apakah phone atau email sudah pernah terdaftar
    const existingMember = await Member.findOne({
      where: {
        [Op.or]: [{ phone }, { email }],
      },
    });

    if (existingMember) {
      return res.status(400).json({ message: "Phone or email already exists" });
    }

    const newMember = await Member.create({
      name,
      phone,
      email,
      total_spent: 0,
      total_points: 0,
    });

    res.status(201).json({
      message: "Member created successfully",
      member: newMember,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating member", error: error.message });
  }
};

// Get all member
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "total_spent",
        "total_points",
      ],
    });
    res.status(200).json(members);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching members", error: error.message });
  }
};

// Get member by phone and email
export const getMemberByIdentifier = async (req, res) => {
  const { identifier } = req.params;

  try {
    const member = await Member.findOne({
      where: {
        [Op.or]: [{ phone: identifier }, { email: identifier }],
      },
      attributes: [
        "id",
        "name",
        "phone",
        "email",
        "total_spent",
        "total_points",
      ],
    });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.status(200).json(member);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching member", error: error.message });
  }
};
