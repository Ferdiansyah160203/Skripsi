import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Purchase = db.define(
  "purchase",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    supplier_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supplier_contact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "partial"),
      allowNull: false,
      defaultValue: "pending",
    },
    payment_method: {
      type: DataTypes.ENUM("cash", "transfer", "credit"),
      allowNull: false,
      defaultValue: "cash",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    invoice_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Purchase;
