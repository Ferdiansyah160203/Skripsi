import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Product from "./ProductModel.js";
import Transaction from "./TransactionModel.js";

const { DataTypes } = Sequelize;

const TransactionProduct = db.define(
  "transaction_products",
  {
    quantity_sold: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    item_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment:
        "Catatan khusus untuk item ini (misal: less sugar, extra hot, dll)",
    },
    used_points: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
  }
);

// Relasi dengan Transaction dan Product
TransactionProduct.belongsTo(Transaction, { foreignKey: "transaction_id" });
Transaction.hasMany(TransactionProduct, { foreignKey: "transaction_id" });

TransactionProduct.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(TransactionProduct, { foreignKey: "product_id" });

export default TransactionProduct;
