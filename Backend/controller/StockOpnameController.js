import StockOpname from "../models/StockOpnameModel.js";
import InventoryModel from "../models/InventoriesModel.js";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import { Op } from "sequelize";
import getStream from "get-stream";

// Create multiple stock opname with one session_id
export const createMultipleStockOpname = async (req, res) => {
  const { items } = req.body; // items: [{ inventories_id, actual_stock }, ...]

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid items data" });
  }

  const session_id = uuidv4(); // generate unique session id

  try {
    // Prepare array untuk bulkCreate
    const opnameData = [];

    for (const item of items) {
      const inventory = await InventoryModel.findByPk(item.inventories_id);
      if (!inventory) {
        return res
          .status(404)
          .json({ message: `Inventory id ${item.inventories_id} not found` });
      }

      const recorded_stock = inventory.stock;
      const actual_stock = item.actual_stock;
      const difference = actual_stock - recorded_stock;

      opnameData.push({
        inventories_id: item.inventories_id,
        recorded_stock,
        actual_stock,
        difference,
        note: item.note || null,
        session_id, // group opname by session
      });
    }

    // Bulk insert semua opname sekaligus
    const createdOpnames = await StockOpname.bulkCreate(opnameData);

    res.status(201).json({
      message: "Multiple stock opname created successfully",
      session_id,
      data: createdOpnames,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create multiple stock opname",
      error: error.message,
    });
  }
};

// Get all stock opname grouped by session_id, show one summary per session
export const getStockOpnameSessions = async (_req, res) => {
  try {
    // Ambil distinct session_id beserta tanggal dan count
    // Gunakan raw query agar bisa grouping dan aggregate
    const sessions = await StockOpname.sequelize.query(
      `SELECT session_id, MIN(createdAt) as createdAt, COUNT(*) as item_count
       FROM StockOpnames
       GROUP BY session_id
       ORDER BY createdAt DESC`,
      { type: StockOpname.sequelize.QueryTypes.SELECT }
    );

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stock opname sessions",
      error: error.message,
    });
  }
};

// Get all opname items by session_id
export const getStockOpnameBySession = async (req, res) => {
  const { session_id } = req.params;

  try {
    const opnames = await StockOpname.findAll({
      where: { session_id },
      attributes: [
        "id",
        "actual_stock",
        "recorded_stock",
        "difference",
        "note",
        "session_id",
        "createdAt",
        "updatedAt",
        "inventories_id",
      ],
      include: [
        {
          model: InventoryModel,
          attributes: ["id", "name", "stock", "unit"],
        },
      ],
    });

    if (opnames.length === 0) {
      return res.status(404).json({ message: "No stock opname found" });
    }

    res.status(200).json(opnames);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch stock opname by session",
      error: error.message,
    });
  }
};

export const downloadStockOpnamePDF = async (req, res) => {
  const response = await api.get(
    `/api/stock-opnames/session/${sessionId}/pdf`,
    {
      responseType: "blob",
    }
  );
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `StockOpname-${sessionId}.pdf`;
  link.click();
  window.URL.revokeObjectURL(url);
};
