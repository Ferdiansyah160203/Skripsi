import Product from "./ProductModel.js";
import InventoryModel from "./InventoriesModel.js";
import ProductMaterial from "./ProductMaterialModel.js";

// Relasi antar model
Product.hasMany(ProductMaterial, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
  as: "ProductMaterials",
});
ProductMaterial.belongsTo(Product, {
  foreignKey: "product_id",
  onDelete: "CASCADE",
});

InventoryModel.hasMany(ProductMaterial, {
  foreignKey: "inventories_id",
  onDelete: "CASCADE",
});
ProductMaterial.belongsTo(InventoryModel, {
  foreignKey: "inventories_id",
  onDelete: "CASCADE",
  as: "inventory",
});

export { Product, InventoryModel, ProductMaterial };
