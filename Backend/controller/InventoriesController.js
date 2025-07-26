import InventoryModel from "../models/InventoriesModel.js";

//create inventory
export const createInventory = async (req, res) => {
  const { name, unit, stock } = req.body;

  try {
    if (!name || !unit || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Allow negative stock values
    const stockValue = parseInt(stock) || 0;

    const newInventory = await InventoryModel.create({
      name,
      unit,
      stock: stockValue,
    });

    res
      .status(201)
      .json({ message: "Inventory created successfully", newInventory });
  } catch (error) {
    res.status(500).json({ message: "Error creating inventory", error });
  }
};

// get all inventories

export const getAllInventories = async (req, res) => {
  try {
    const inventories = await InventoryModel.findAll();
    res.status(200).json(inventories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventories", error });
  }
};

// get inventory by id

export const getInventoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await InventoryModel.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
};

// update inventory by id

export const updateInventory = async (req, res) => {
  const { id } = req.params;
  const { name, unit, stock } = req.body;

  try {
    const inventory = await InventoryModel.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    inventory.name = name || inventory.name;
    inventory.unit = unit || inventory.unit;

    // Allow negative stock values - no validation for minimum stock
    if (stock !== undefined) {
      inventory.stock = parseInt(stock) || 0;
    }

    await inventory.save();

    res
      .status(200)
      .json({ message: "Inventory updated successfully", inventory });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
};

//Delete inventory by id

export const deleteInventory = async (req, res) => {
  const { id } = req.params;
  try {
    const inventory = await InventoryModel.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    await inventory.destroy();

    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory", error });
  }
};

// Reduce inventory stock (for orders) - allows negative stock
export const reduceInventoryStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const inventory = await InventoryModel.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Allow stock to go negative - no stock validation
    const newStock = inventory.stock - parseInt(quantity);
    inventory.stock = newStock;

    await inventory.save();

    const status =
      newStock < 0 ? "Stock is now negative" : "Stock reduced successfully";

    res.status(200).json({
      message: status,
      inventory,
      previousStock: inventory.stock + parseInt(quantity),
      reducedBy: parseInt(quantity),
      currentStock: newStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Error reducing inventory stock", error });
  }
};

// Add inventory stock (for restocking)
export const addInventoryStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Valid quantity is required" });
    }

    const inventory = await InventoryModel.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const newStock = inventory.stock + parseInt(quantity);
    inventory.stock = newStock;

    await inventory.save();

    res.status(200).json({
      message: "Stock added successfully",
      inventory,
      previousStock: inventory.stock - parseInt(quantity),
      addedBy: parseInt(quantity),
      currentStock: newStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding inventory stock", error });
  }
};
