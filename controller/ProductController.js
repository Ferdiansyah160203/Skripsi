import {
  Product,
  ProductMaterial,
  InventoryModel,
} from "../models/associations.js";

//get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: ProductMaterial,
        include: InventoryModel, // relasi dari Product -> ProductMaterial -> Inventory
      },
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export const getAvailableProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductMaterial,
          include: [
            {
              model: InventoryModel, 
            },
          ],
        },
      ],
    });

    // Filter produk yang tersedia berdasarkan stok
    const result = products.map((product) => {
      const isAvailable = product.ProductMaterials.every((material) => {
        const inventory = material.inventory; 
        return inventory && inventory.stock >= material.quantity_used;
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
        available: isAvailable, // Tambahkan status availability
      };
    });

    res.status(200).json(result); // Kirim hasil produk yang tersedia dengan status availability
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available products",
      error: error.message,
    });
  }
};

//create product
export const createProduct = async (req, res) => {
  const { name, price, description, materials } = req.body; // materials is an array of { inventoryId, quantity_used }

  try {
    // Validasi input
    if (!name || !price || !materials || materials.length === 0) {
      return res
        .status(400)
        .json({ message: "Name, price, and materials are required" });
    }

    // Create Product
    const newProduct = await Product.create({
      name,
      price,
      description,
    });

    const productMaterials = materials.map((material) => ({
      product_id: newProduct.id,
      inventories_id: material.inventories_id,
      quantity_used: material.quantity_used,
    }));
    await ProductMaterial.bulkCreate(productMaterials);

    // Update Stock pada Inventory setelah produk dibuat
    for (let material of materials) {
      const inventory = await InventoryModel.findByPk(material.inventoriesId);
      if (inventory) {
        inventory.stock -= material.quantity_used;
        await inventory.save();
      }
    }

    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update data product
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete product by id
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};
