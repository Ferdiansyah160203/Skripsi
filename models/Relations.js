import Product from "./ProductModel.js";
import Material from "./MaterialModel.js";
import ProductMaterial from "./ProductMaterialModel.js";
import Transaction from "./TransactionModel.js";
import TransactionItem from "./TransactionItemModel.js";
import Member from "./MemberModel.js";

// Produk banyak bahan
Product.belongsToMany(Material, {
  through: ProductMaterial,
  foreignKey: "productId",
});
Material.belongsToMany(Product, {
  through: ProductMaterial,
  foreignKey: "materialId",
});

// Transaksi banyak item produk
Transaction.hasMany(TransactionItem, { foreignKey: "transactionId" });
TransactionItem.belongsTo(Transaction, { foreignKey: "transactionId" });

TransactionItem.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(TransactionItem, { foreignKey: "productId" });

// Transaksi bisa milik Member (optional)
Member.hasMany(Transaction, { foreignKey: "memberId" });
Transaction.belongsTo(Member, { foreignKey: "memberId" });
