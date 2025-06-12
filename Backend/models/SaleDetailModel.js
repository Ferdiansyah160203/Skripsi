import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Sale from "./SaleModel.js";
import Product from "./ProductModel.js";

const SaleDetail = db.define("saledetail", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_each: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Relasi
SaleDetail.belongsTo(Sale, { foreignKey: "sale_id" });
Sale.hasMany(SaleDetail, { foreignKey: "sale_id" });

SaleDetail.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(SaleDetail, { foreignKey: "product_id" });

export default SaleDetail;
