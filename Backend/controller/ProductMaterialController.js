import ProductMaterial from "../models/ProductMaterialModel.js";
import Product from "../models/ProductModel.js";
import InventoryModel from "../models/InventoriesModel.js";

export const addProductMaterial = async (req, res) => {
  const { product_id, inventory_id, quantity_used } = req.body;

  try {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const inventory = await InventoryModel.findByPk(inventory_id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Menambah bahan ke produk
    const newProductMaterial = await ProductMaterial.create({
      product_id,
      inventory_id,
      quantity_used,
    });

    res.status(201).json({
      message: "Product material added successfully",
      newProductMaterial,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding product material", error });
  }
};
