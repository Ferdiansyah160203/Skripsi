// models/TransactionModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Member from "./MemberModel.js";

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transactions",
  {
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    final_price: {
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
      defaultValue: "unpaid", // paid, unpaid, cancelled
    },
    discount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    quantity_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    // Kolom baru untuk menyimpan uang yang dibayar
    cash_paid: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    // Kolom baru untuk menyimpan kembalian
    change: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relasi dengan Product
Transaction.belongsTo(Member, { foreignKey: "members_id" });
Member.hasMany(Transaction, { foreignKey: "members_id" });

export default Transaction;
