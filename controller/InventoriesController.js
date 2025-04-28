import InventoryModel from "../models/InventoriesModel.js";

//create inventory
export const createInventory = async (req, res) => {
  const { name, unit, stock } = req.body;

  try {
    if (!name || !unit || stock === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newInventory = await InventoryModel.create({
      name,
      unit,
      stock,
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
    inventory.stock = stock !== undefined ? stock : inventory.stock;

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
