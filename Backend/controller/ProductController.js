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

    const result = products.map((product) => {
      const materials = product.ProductMaterials || [];

      const isAvailable =
        materials.length > 0 &&
        materials.every((material) => {
          const inventory = material.inventory;
          return inventory && inventory.stock >= material.quantity_used;
        });

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.image,
        available: isAvailable,
      };
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching available products",
      error: error.message,
    });
  }
};

//create product
export const createProduct = async (req, res) => {
  const { name, price, description, materials, category } = req.body;
  let parsedMaterials = [];

  try {
    // Parse materials string ke array JSON
    if (typeof materials === "string") {
      parsedMaterials = JSON.parse(materials);
    } else {
      parsedMaterials = materials;
    }

    if (!name || !price || parsedMaterials.length === 0) {
      return res
        .status(400)
        .json({ message: "Name, price, and materials are required" });
    }

    const validCategories = ["nasi", "camilan", "roti", "kopi", "non kopi"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newProduct = await Product.create({
      name,
      price,
      category,
      description,
      image: imagePath,
    });

    const productMaterials = parsedMaterials.map((material) => ({
      product_id: newProduct.id,
      inventories_id: material.inventories_id,
      quantity_used: material.quantity_used,
    }));
    await ProductMaterial.bulkCreate(productMaterials);

    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error); // tampilkan detail di log
    res.status(500).json({
      message: "Error creating product",
      error: error.message || "Unknown error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, materials } = req.body;
  let parsedMaterials = [];

  try {
    // Parse materials string ke array JSON
    if (typeof materials === "string") {
      parsedMaterials = JSON.parse(materials);
    } else {
      parsedMaterials = materials;
    }

    if (!name || !price || parsedMaterials.length === 0) {
      return res
        .status(400)
        .json({ message: "Name, price, and materials are required" });
    }

    const validCategories = ["nasi", "camilan", "roti", "kopi", "non kopi"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : product.image;

    product.name = name;
    product.price = price;
    product.category = category;
    product.description = description;
    product.image = imagePath;

    await product.save();

    // Update ProductMaterial
    await ProductMaterial.destroy({ where: { product_id: id } });

    const productMaterials = parsedMaterials.map((material) => ({
      product_id: id,
      inventories_id: material.inventories_id,
      quantity_used: material.quantity_used,
    }));
    await ProductMaterial.bulkCreate(productMaterials);

    res.status(200).json({
      message: "Product updated successfully",
      product: product,
      materials: productMaterials,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
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

//get product by id

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: {
        model: ProductMaterial,
        include: InventoryModel,
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};
