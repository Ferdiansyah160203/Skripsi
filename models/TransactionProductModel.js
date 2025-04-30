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
