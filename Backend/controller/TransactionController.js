import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import Inventory from "../models/InventoriesModel.js";
import ProductMaterial from "../models/ProductMaterialModel.js";
import TransactionProduct from "../models/TransactionProductModel.js";
import Member from "../models/MemberModel.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res) => {
  const {
    payment_method,
    discount = 0,
    member_identifier,
    products,
    cash_paid = 0, // Menambahkan cash_paid dari request
  } = req.body;

  const items = [];

  try {
    if (!products || products.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one product is required" });
    }

    let total_price = 0;
    let quantity_sold = 0;

    for (const item of products) {
      const foundProduct = await Product.findByPk(item.product_id);
      if (!foundProduct) {
        return res.status(404).json({
          message: `Product with ID ${item.product_id} not found`,
        });
      }

      const subTotal = foundProduct.price * item.quantity_sold;

      // Menambahkan produk ke array items
      items.push({
        product_id: foundProduct.id,
        name: foundProduct.name,
        price: foundProduct.price,
        qty: item.quantity_sold,
        subtotal: subTotal,
      });

      total_price += subTotal;
      quantity_sold += item.quantity_sold;
    }

    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;

    // Menghitung kembalian
    const change = cash_paid - final_price;

    // Optional: Temukan member (jika ada)
    let member = null;
    if (member_identifier) {
      member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });
    }

    // Simpan transaksi ke database
    const transaction = await Transaction.create({
      total_price,
      final_price,
      payment_method,
      discount: discountAmount,
      quantity_sold,
      status: "unpaid",
      member_id: member ? member.id : null,
      items: JSON.stringify(items),
      cash_paid, // Menyimpan cash_paid
      change, // Menyimpan change
    });

    // Tambahkan poin ke member (jika ada)
    if (member) {
      member.total_spent += final_price;
      member.total_points += Math.floor(final_price / 10000);
      await member.save();
    }

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { payment_method, discount, products } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let totalPrice = 0;
    const updatedItems = Array.isArray(transaction.items)
      ? transaction.items
      : [];

    for (const item of products) {
      const product = await Product.findByPk(item.product_id);
      if (!product) continue;

      const subtotal = product.price * item.quantity_sold;
      totalPrice += subtotal;

      updatedItems.push({
        product_id: item.product_id,
        quantity_sold: item.quantity_sold,
        subtotal,
      });
    }

    const discountAmount = (totalPrice * discount) / 100;
    const finalPrice = totalPrice - discountAmount;

    // Update transaksi
    transaction.payment_method = payment_method;
    transaction.discount = discountAmount;
    transaction.total_price = totalPrice;
    transaction.final_price = finalPrice;
    transaction.items = updatedItems; // Store items as an array

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transaction", error: error.message });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    // Ambil detail produk
    const items = await TransactionProduct.findAll({
      where: { transaction_id: transaction.id },
      include: [{ model: Product, attributes: ["name"] }],
    });

    const mappedItems = items.map((item) => ({
      product_id: item.product_id,
      name: item.Product?.name || "Nama tidak tersedia",
      qty: item.quantity_sold,
      price: item.price,
      subtotal: item.quantity_sold * item.price,
    }));

    const response = {
      ...transaction.toJSON(),
      items: mappedItems,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal mengambil transaksi" });
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
  const { payment_method, member_identifier, cash_paid } = req.body;

  try {
    // Cari transaksi berdasarkan ID
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Pastikan transaksi belum dibayar
    if (transaction.status === "paid") {
      return res.status(400).json({ message: "Transaction already paid" });
    }

    // Parse items kalau masih dalam bentuk string
    let items = [];
    try {
      items =
        typeof transaction.items === "string"
          ? JSON.parse(transaction.items)
          : transaction.items;
    } catch (error) {
      return res
        .status(400)
        .json({ message: "Error parsing transaction items" });
    }

    // Pastikan member identifier diisi jika menggunakan poin
    const isUsingPoints = items.some((item) => item.used_points > 0);
    if (isUsingPoints && !member_identifier) {
      return res
        .status(400)
        .json({ message: "Member identifier is required to redeem points" });
    }

    // Hitung kembalian
    const change = cash_paid - transaction.final_price;

    // Update status transaksi dan informasi pembayaran
    transaction.status = "paid";
    transaction.payment_method = payment_method || transaction.payment_method;
    transaction.cash_paid = cash_paid; // Update cash_paid
    transaction.change = change; // Update change

    // Tambahkan member jika ada
    if (member_identifier && !transaction.member_id) {
      const member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });

      // Tambahkan poin ke member (jika ada)
      if (member) {
        // Pastikan untuk mengurangi poin jika poin digunakan dalam transaksi
        if (items.some((item) => item.used_points > 0)) {
          member.total_points -= items.reduce(
            (acc, item) => acc + item.used_points,
            0
          );
        } else {
          member.total_spent += transaction.final_price;
          member.total_points += Math.floor(transaction.final_price / 10000);
        }
        await member.save();
      }
    }

    await transaction.save();

    res.status(200).json({
      message: "Transaction marked as paid successfully",
      transaction: {
        ...transaction.toJSON(),
        change, // Pastikan change dikirimkan langsung
      },
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
