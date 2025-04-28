import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";

export const createTransaction = async (req, res) => {
  const { product_id, quantity_sold, payment_method, discount } = req.body;

  try {
    if (!product_id || !quantity_sold || !payment_method) {
      return res.status(400).json({
        message: "Product ID, quantity sold, and payment method are required",
      });
    }

    // Ambil data produk
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Hitung total price (quantity_sold * price produk)
    const total_price = product.price * quantity_sold;

    // Hitung discount
    const discountAmount = (total_price * discount) / 100;

    // Hitung final_price setelah diskon
    const final_price = total_price - discountAmount;

    // Buat transaksi baru
    const transaction = await Transaction.create({
      total_price,
      final_price,
      payment_method,
      quantity_sold,
      discount: discountAmount,
      product_id, // Relasikan dengan produk
      status: "unpaid", // Status default
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

    // Ambil data produk untuk menghitung harga baru
    const product = await Product.findByPk(transaction.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Hitung total price dan final price
    const total_price = product.price * quantity_sold;
    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;

    // Update transaksi
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

// Mendapatkan transaksi berdasarkan ID
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

// Mendapatkan semua transaksi
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

// Update status transaksi menjadi "paid"
export const markAsPaid = async (req, res) => {
  const { id } = req.params; // ID transaksi yang ingin diupdate
  const { payment_method } = req.body; // Metode pembayaran yang diterima

  try {
    // Cari transaksi berdasarkan ID
    const transaction = await Transaction.findByPk(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Update status transaksi menjadi "paid"
    transaction.status = "paid";
    transaction.payment_method = payment_method || transaction.payment_method;

    // Simpan perubahan status transaksi
    await transaction.save();

    // Response sukses
    res.status(200).json({
      message: "Transaction marked as paid successfully",
      transaction,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating transaction status", error });
  }
};
