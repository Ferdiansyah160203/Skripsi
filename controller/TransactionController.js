import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import Inventory from "../models/InventoriesModel.js";
import ProductMaterial from "../models/ProductMaterialModel.js";
import Member from "../models/MemberModel.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res) => {
  const { product_id, quantity_sold, payment_method, discount, member_id } =
    req.body;

  try {
    if (!product_id || !quantity_sold || !payment_method) {
      return res.status(400).json({
        message: "Product ID, quantity sold, and payment method are required",
      });
    }

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const total_price = product.price * quantity_sold;
    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;

    const transaction = await Transaction.create({
      total_price,
      final_price,
      payment_method,
      quantity_sold,
      discount: discountAmount,
      product_id,
      status: "unpaid",
      member_id: member_id || null,
    });

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { quantity_sold, payment_method, discount } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const product = await Product.findByPk(transaction.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const total_price = product.price * quantity_sold;
    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;

    transaction.quantity_sold = quantity_sold || transaction.quantity_sold;
    transaction.payment_method = payment_method || transaction.payment_method;
    transaction.discount = discountAmount || transaction.discount;
    transaction.total_price = total_price || transaction.total_price;
    transaction.final_price = final_price || transaction.final_price;

    await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transaction", error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transaction", error: error.message });
  }
};

export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching transactions", error: error.message });
  }
};

export const markAsPaid = async (req, res) => {
  const { id } = req.params;
  const { payment_method, member_identifier } = req.body;

  try {
    // Cari transaksi berdasarkan ID
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Cek apakah transaksi sudah dibayar
    if (transaction.status === "paid") {
      return res.status(400).json({ message: "Transaction already paid" });
    }

    // Ambil produk yang terlibat dalam transaksi ini
    const product = await Product.findByPk(transaction.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ambil semua bahan yang digunakan untuk membuat produk ini
    const materials = await ProductMaterial.findAll({
      where: { product_id: transaction.product_id },
      include: Inventory, // Menyertakan data inventory terkait
    });

    // Cek dan kurangi stok setiap bahan yang digunakan
    for (const material of materials) {
      const inventory = await Inventory.findByPk(material.inventories_id);
      if (!inventory) {
        return res.status(404).json({
          message: `Inventory not found for material ID ${material.inventories_id}`,
        });
      }

      const totalUsed = material.quantity_used * transaction.quantity_sold;

      if (inventory.stock < totalUsed) {
        return res.status(400).json({
          message: `Not enough stock for inventory "${inventory.name}". Required: ${totalUsed}, Available: ${inventory.stock}`,
        });
      }

      // Kurangi stok bahan di inventory
      inventory.stock -= totalUsed;
      await inventory.save();
    }

    // Update status transaksi menjadi "paid"
    transaction.status = "paid";
    transaction.payment_method = payment_method || transaction.payment_method;

    // Tambahkan member jika ada identifier
    if (member_identifier && !transaction.members_id) {
      const member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });

      if (member) {
        transaction.members_id = member.id;

        // Tambahkan poin dan total_spent
        member.total_spent += transaction.final_price;
        const pointsEarned = Math.floor(transaction.final_price / 10000);
        member.total_points += pointsEarned;

        await member.save();
      }
    }

    // Simpan transaksi yang sudah diupdate
    await transaction.save();

    res.status(200).json({
      message: "Transaction marked as paid successfully",
      transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating transaction status",
      error: error.message,
    });
  }
};
