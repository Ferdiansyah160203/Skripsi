// models/TransactionModel.js
import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Product from "./ProductModel.js";

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
      allowNull: false, // Jumlah produk yang dijual dalam transaksi ini
    },
  },
  {
    freezeTableName: true,
  }
);

// Relasi dengan Product
Transaction.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Transaction, { foreignKey: "product_id" });

export default Transaction;
