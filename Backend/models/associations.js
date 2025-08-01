import Product from "./ProductModel.js";
import InventoryModel from "./InventoriesModel.js";
import ProductMaterial from "./ProductMaterialModel.js";
import Purchase from "./PurchaseModel.js";
import PurchaseItem from "./PurchaseItemModel.js";

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

// Relasi untuk Purchase dan PurchaseItem
Purchase.hasMany(PurchaseItem, {
  foreignKey: "purchase_id",
  onDelete: "CASCADE",
  as: "items",
});
PurchaseItem.belongsTo(Purchase, {
  foreignKey: "purchase_id",
  onDelete: "CASCADE",
});

InventoryModel.hasMany(PurchaseItem, {
  foreignKey: "inventory_id",
  onDelete: "CASCADE",
});
PurchaseItem.belongsTo(InventoryModel, {
  foreignKey: "inventory_id",
  onDelete: "CASCADE",
  as: "inventory",
});

export { Product, InventoryModel, ProductMaterial, Purchase, PurchaseItem };
