import {
  Purchase,
  PurchaseItem,
  InventoryModel,
} from "../models/associations.js";
import { Op } from "sequelize";
import db from "../config/Database.js";

// Get all purchases
export const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        {
          model: PurchaseItem,
          as: "items",
          include: [
            {
              model: InventoryModel,
              as: "inventory",
              attributes: ["id", "name", "unit"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get purchase by ID
export const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id, {
      include: [
        {
          model: PurchaseItem,
          as: "items",
          include: [
            {
              model: InventoryModel,
              as: "inventory",
              attributes: ["id", "name", "unit"],
            },
          ],
        },
      ],
    });

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create new purchase
export const createPurchase = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const {
      supplier_name,
      supplier_contact,
      purchase_date,
      payment_status,
      payment_method,
      notes,
      invoice_number,
      items,
    } = req.body;

    // Validate required fields
    if (!supplier_name || !items || items.length === 0) {
      return res.status(400).json({
        message: "Supplier name and items are required",
      });
    }

    // Calculate total amount
    let total_amount = 0;
    for (const item of items) {
      if (!item.inventory_id || !item.quantity || !item.unit_price) {
        await transaction.rollback();
        return res.status(400).json({
          message: "Each item must have inventory_id, quantity, and unit_price",
        });
      }
      total_amount += item.quantity * item.unit_price;
    }

    // Create purchase
    const purchase = await Purchase.create(
      {
        supplier_name,
        supplier_contact,
        purchase_date: purchase_date || new Date(),
        total_amount,
        payment_status: payment_status || "pending",
        payment_method: payment_method || "cash",
        notes,
        invoice_number,
      },
      { transaction }
    );

    // Create purchase items and update inventory stock
    for (const item of items) {
      // Create purchase item
      await PurchaseItem.create(
        {
          purchase_id: purchase.id,
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.quantity * item.unit_price,
          expiry_date: item.expiry_date,
          notes: item.notes,
        },
        { transaction }
      );

      // Update inventory stock
      const inventory = await InventoryModel.findByPk(item.inventory_id, {
        transaction,
      });
      if (inventory) {
        await inventory.update(
          {
            stock: inventory.stock + item.quantity,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // Fetch the created purchase with includes
    const createdPurchase = await Purchase.findByPk(purchase.id, {
      include: [
        {
          model: PurchaseItem,
          as: "items",
          include: [
            {
              model: InventoryModel,
              as: "inventory",
              attributes: ["id", "name", "unit"],
            },
          ],
        },
      ],
    });

    res.status(201).json({
      message: "Purchase created successfully",
      data: createdPurchase,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update purchase
export const updatePurchase = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;
    const {
      supplier_name,
      supplier_contact,
      payment_status,
      payment_method,
      notes,
      invoice_number,
    } = req.body;

    const purchase = await Purchase.findByPk(id, { transaction });

    if (!purchase) {
      await transaction.rollback();
      return res.status(404).json({ message: "Purchase not found" });
    }

    await purchase.update(
      {
        supplier_name: supplier_name || purchase.supplier_name,
        supplier_contact: supplier_contact || purchase.supplier_contact,
        payment_status: payment_status || purchase.payment_status,
        payment_method: payment_method || purchase.payment_method,
        notes: notes || purchase.notes,
        invoice_number: invoice_number || purchase.invoice_number,
      },
      { transaction }
    );

    await transaction.commit();

    const updatedPurchase = await Purchase.findByPk(id, {
      include: [
        {
          model: PurchaseItem,
          as: "items",
          include: [
            {
              model: InventoryModel,
              as: "inventory",
              attributes: ["id", "name", "unit"],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message: "Purchase updated successfully",
      data: updatedPurchase,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete purchase
export const deletePurchase = async (req, res) => {
  const transaction = await db.transaction();

  try {
    const { id } = req.params;

    const purchase = await Purchase.findByPk(id, {
      include: [
        {
          model: PurchaseItem,
          as: "items",
        },
      ],
      transaction,
    });

    if (!purchase) {
      await transaction.rollback();
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Revert inventory stock
    for (const item of purchase.items) {
      const inventory = await InventoryModel.findByPk(item.inventory_id, {
        transaction,
      });
      if (inventory) {
        await inventory.update(
          {
            stock: Math.max(0, inventory.stock - item.quantity),
          },
          { transaction }
        );
      }
    }

    // Delete purchase (items will be deleted automatically due to CASCADE)
    await purchase.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting purchase:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get purchase statistics
export const getPurchaseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        purchase_date: {
          [Op.between]: [new Date(startDate), new Date(endDate)],
        },
      };
    }

    const totalPurchases = await Purchase.count({
      where: dateFilter,
    });

    const totalAmount = await Purchase.sum("total_amount", {
      where: {
        ...dateFilter,
        payment_status: "paid",
      },
    });

    const pendingAmount = await Purchase.sum("total_amount", {
      where: {
        ...dateFilter,
        payment_status: ["pending", "partial"],
      },
    });

    res.status(200).json({
      totalPurchases,
      totalAmount: totalAmount || 0,
      pendingAmount: pendingAmount || 0,
    });
  } catch (error) {
    console.error("Error fetching purchase stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
