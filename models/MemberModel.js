// models/MemberModel.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Member = db.define("members", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  total_spent: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  total_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Member;
