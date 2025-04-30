import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import Inventory from "../models/InventoriesModel.js";
import ProductMaterial from "../models/ProductMaterialModel.js";
import TransactionProduct from "../models/TransactionProductModel.js";
import Member from "../models/MemberModel.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res) => {
  const { payment_method, discount, member_identifier, products } = req.body;

  try {
    // Validasi produk
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product is required" });
    }

    // Hitung total harga dan final price
    let total_price = 0;
    let quantity_sold = 0;

    for (const product of products) {
      const foundProduct = await Product.findByPk(product.product_id);
      if (!foundProduct) {
        return res
          .status(404)
          .json({ message: `Product with ID ${product.product_id} not found` });
      }

      total_price += foundProduct.price * product.quantity_sold;
      quantity_sold += product.quantity_sold;
    }

    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;

    // Buat transaksi baru
    const transaction = await Transaction.create({
      total_price,
      final_price,
      payment_method,
      discount: discountAmount,
      quantity_sold,
      status: "unpaid",
      member_id: member_identifier ? member_identifier : null,
    });

    // Simpan setiap produk dalam transaksi
    for (const product of products) {
      const foundProduct = await Product.findByPk(product.product_id);
      await TransactionProduct.create({
        transaction_id: transaction.id,
        product_id: product.product_id,
        quantity_sold: product.quantity_sold,
        price: foundProduct.price,
      });
    }

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

    if (transaction.status === "paid") {
      return res.status(400).json({ message: "Transaction already paid" });
    }

    // Ambil semua produk dalam transaksi ini
    const transactionProducts = await TransactionProduct.findAll({
      where: { transaction_id: transaction.id },
    });

    if (transactionProducts.length === 0) {
      return res
        .status(400)
        .json({ message: "No products found in transaction" });
    }

    // Untuk setiap produk dalam transaksi
    for (const tp of transactionProducts) {
      const product = await Product.findByPk(tp.product_id);
      if (!product) continue;

      // Ambil semua bahan yang digunakan oleh produk ini
      const materials = await ProductMaterial.findAll({
        where: { product_id: product.id },
        include: Inventory,
      });

      // Cek dan kurangi stok
      for (const material of materials) {
        const inventory = await Inventory.findByPk(material.inventories_id);
        if (!inventory) {
          return res.status(404).json({
            message: `Inventory not found for material ID ${material.inventories_id}`,
          });
        }

        const totalUsed = material.quantity_used * tp.quantity_sold;

        if (inventory.stock < totalUsed) {
          return res.status(400).json({
            message: `Not enough stock for "${inventory.name}". Required: ${totalUsed}, Available: ${inventory.stock}`,
          });
        }

        inventory.stock -= totalUsed;
        await inventory.save();
      }
    }

    // Tandai sebagai sudah dibayar
    transaction.status = "paid";
    transaction.payment_method = payment_method || transaction.payment_method;

    // Tambahkan member jika ada
    if (member_identifier && !transaction.members_id) {
      const member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });

      if (member) {
        transaction.members_id = member.id;
        member.total_spent += transaction.final_price;
        const pointsEarned = Math.floor(transaction.final_price / 10000);
        member.total_points += pointsEarned;
        await member.save();
      }
    }

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

// Fungsi untuk membatalkan transaksi

export const cancelTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "paid") {
      return res
        .status(400)
        .json({ message: "Cannot cancel a paid transaction" });
    }

    if (transaction.status === "cancelled") {
      return res.status(400).json({ message: "Transaction already cancelled" });
    }

    transaction.status = "cancelled";
    await transaction.save();

    res
      .status(200)
      .json({ message: "Transaction cancelled successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling transaction", error: error.message });
  }
};
