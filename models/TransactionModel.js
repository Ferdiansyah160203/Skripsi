// models/TransactionModel.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Transaction = db.define("transactions", {
  total_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "paid", // paid, unpaid, cancelled
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
});

export default Transaction;
