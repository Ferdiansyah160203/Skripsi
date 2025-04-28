import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Product from "./ProductModel.js";
import InventoryModel from "./InventoriesModel.js";

const ProductMaterial = db.define("ProductMaterial", {
  quantity_used: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

// Relasi
ProductMaterial.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});
Product.hasMany(ProductMaterial, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

ProductMaterial.belongsTo(InventoryModel, {
  foreignKey: "inventories_id",
  onDelete: "CASCADE",
});
InventoryModel.hasMany(ProductMaterial, {
  foreignKey: "inventories_id",
  onDelete: "CASCADE",
});

export default ProductMaterial;
