import Product from "./ProductModel.js";
import InventoryModel from "./InventoriesModel.js";
import ProductMaterial from "./ProductMaterialModel.js";

// Penting: Definisikan ulang relasi di sini
Product.hasMany(ProductMaterial, { foreignKey: "product_id" });
ProductMaterial.belongsTo(Product, { foreignKey: "product_id" });

InventoryModel.hasMany(ProductMaterial, { foreignKey: "inventories_id" });
ProductMaterial.belongsTo(InventoryModel, { foreignKey: "inventories_id" });

export { Product, InventoryModel, ProductMaterial };
