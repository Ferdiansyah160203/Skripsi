import StockOpname from "../models/StockOpnameModel.js";
import Inventory from "../models/InventoryModel.js";

export const createStockOpname = async (req, res) => {
  const { inventory_id, actual_stock, note } = req.body;

  try {
    // Validasi: pastikan inventory ada
    const inventory = await Inventory.findByPk(inventory_id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const recorded_stock = inventory.stock;
    const difference = actual_stock - recorded_stock;

    // Simpan ke tabel StockOpname
    const opname = await StockOpname.create({
      inventory_id,
      actual_stock,
      recorded_stock,
      difference,
      note,
    });

    // Update stok di tabel inventory jika kamu ingin langsung disesuaikan:
    // inventory.stock = actual_stock;
    // await inventory.save();

    res.status(201).json({
      message: "Stock opname recorded successfully",
      data: opname,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record stock opname",
      error: error.message,
    });
  }
};

export const getAllStockOpname = async (req, res) => {
  try {
    const data = await StockOpname.findAll({
      include: {
        model: Inventory,
        attributes: ["name", "unit"], // atau semua atribut jika perlu
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch stock opname", error: error.message });
  }
};
