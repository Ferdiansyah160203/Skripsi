// models/MemberModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

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
