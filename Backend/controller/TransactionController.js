import Transaction from "../models/TransactionModel.js";
import Product from "../models/ProductModel.js";
import TransactionProduct from "../models/TransactionProductModel.js";
import { ProductMaterial, InventoryModel } from "../models/associations.js";
import Member from "../models/MemberModel.js";
import PointPromo from "../models/PointPromoModel.js";
import { Op } from "sequelize";

export const createTransaction = async (req, res) => {
  const {
    payment_method,
    discount = 0,
    member_identifier,
    products,
    cash_paid = 0,
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
    let member = null;

    if (member_identifier) {
      member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });
    }

    // Validasi semua produk dan simpan ke item[]
    for (const item of products) {
      const foundProduct = await Product.findByPk(item.product_id);
      if (!foundProduct) {
        return res.status(404).json({
          message: `Product with ID ${item.product_id} not found`,
        });
      }

      const used_points = item.used_points || 0;
      const subTotal = foundProduct.price * item.quantity_sold;

      items.push({
        product_id: foundProduct.id,
        name: foundProduct.name,
        price: foundProduct.price,
        qty: item.quantity_sold,
        subtotal: subTotal,
        used_points,
      });

      total_price += subTotal;
      quantity_sold += item.quantity_sold;

      // === Kurangi stok bahan ===
      const productMaterials = await ProductMaterial.findAll({
        where: { product_id: foundProduct.id },
      });

      for (const material of productMaterials) {
        const inventory = await InventoryModel.findByPk(
          material.inventories_id
        );
        if (!inventory) continue;

        const totalUsed = material.quantity_used * item.quantity_sold;

        if (inventory.stock < totalUsed) {
          return res.status(400).json({
            message: `Stok tidak cukup untuk bahan ${inventory.name}`,
          });
        }

        inventory.stock -= totalUsed;
        await inventory.save();
      }
    }

    const discountAmount = (total_price * discount) / 100;
    const final_price = total_price - discountAmount;
    const change = cash_paid - final_price;

    // === Proses pembayaran dengan POIN langsung saat create ===
    if (payment_method === "points") {
      if (!member_identifier) {
        return res.status(400).json({
          message: "Member identifier is required for points payment",
        });
      }

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      // Hitung total poin yang dibutuhkan
      const productIds = products.map((item) => item.product_id);
      const promos = await PointPromo.findAll({
        where: {
          product_id: productIds,
          is_active: true,
        },
      });

      let totalUsedPoints = 0;

      // Update items dengan used_points dari promo
      for (const item of items) {
        const promo = promos.find((p) => p.product_id === item.product_id);
        if (promo) {
          const usedPoints = promo.point_cost * item.qty;
          item.used_points = usedPoints;
          totalUsedPoints += usedPoints;
        }
      }

      // Jika tidak ada promo, gunakan konversi harga ke poin (asumsi: 1000 rupiah = 1 poin)
      if (totalUsedPoints === 0) {
        totalUsedPoints = Math.ceil(final_price / 1000);
      }

      if (member.total_points < totalUsedPoints) {
        return res.status(400).json({
          message: "Insufficient points",
          required_points: totalUsedPoints,
          available_points: member.total_points,
        });
      }

      // Kurangi poin member
      member.total_points -= totalUsedPoints;
      await member.save();
    }

    const transaction = await Transaction.create({
      total_price,
      final_price,
      payment_method,
      discount: discountAmount,
      quantity_sold,
      status: payment_method === "points" ? "paid" : "unpaid", // Langsung paid jika pakai poin
      members_id: member ? member.id : null,
      items: JSON.stringify(items),
      cash_paid: payment_method === "points" ? 0 : cash_paid,
      change: payment_method === "points" ? 0 : change,
      change,
    });

    // Simpan detail transaksi per produk
    for (const item of items) {
      await TransactionProduct.create({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity_sold: item.qty,
        price: item.price,
        used_points: item.used_points,
      });
    }

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res
      .status(500)
      .json({ message: "Error creating transaction", error: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { payment_method, discount = 0, products = [] } = req.body;

  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    let totalPrice = 0;
    let quantitySold = 0;
    const updatedItems = [];

    await TransactionProduct.destroy({ where: { transaction_id: id } });

    for (const item of products) {
      const product = await Product.findByPk(item.product_id);
      if (!product) continue;

      const subtotal = product.price * item.quantity_sold;
      totalPrice += subtotal;
      quantitySold += item.quantity_sold;

      updatedItems.push({
        product_id: item.product_id,
        name: product.name,
        price: product.price,
        qty: item.quantity_sold,
        subtotal,
      });

      await TransactionProduct.create({
        transaction_id: id,
        product_id: item.product_id,
        quantity_sold: item.quantity_sold,
        price: product.price,
      });
    }

    const discountAmount = (totalPrice * discount) / 100;
    const finalPrice = totalPrice - discountAmount;

    transaction.payment_method = payment_method;
    transaction.discount = discountAmount;
    transaction.total_price = totalPrice;
    transaction.final_price = finalPrice;
    transaction.quantity_sold = quantitySold;
    transaction.items = JSON.stringify(updatedItems);

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

export const getAllTransactions = async (_unused, res) => {
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
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "paid") {
      return res.status(400).json({ message: "Transaction already paid" });
    }

    const items = await TransactionProduct.findAll({
      where: { transaction_id: transaction.id },
      include: [{ model: Product, attributes: ["name"] }],
    });

    const parsedItems = items.map((item) => ({
      product_id: item.product_id,
      name: item.Product?.name || "Nama tidak tersedia",
      qty: item.quantity_sold,
      price: item.price,
      subtotal: item.quantity_sold * item.price,
      used_points: item.used_points || 0,
    }));

    const productIds = parsedItems.map((item) => item.product_id);
    const promos = await PointPromo.findAll({
      where: {
        product_id: productIds,
        is_active: true,
      },
    });

    // === Pembayaran dengan POIN ===
    if (payment_method === "points") {
      if (!member_identifier) {
        return res.status(400).json({
          message: "Member identifier is required for points payment",
        });
      }

      const member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });

      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }

      let totalUsedPoints = 0;

      for (const item of parsedItems) {
        const promo = promos.find((p) => p.product_id === item.product_id);
        if (promo) {
          const usedPoints = promo.point_cost * item.qty;
          item.used_points = usedPoints;
          totalUsedPoints += usedPoints;

          // Simpan used_points
          await TransactionProduct.update(
            { used_points: usedPoints },
            {
              where: {
                transaction_id: transaction.id,
                product_id: item.product_id,
              },
            }
          );
        }
      }

      if (member.total_points < totalUsedPoints) {
        return res.status(400).json({ message: "Insufficient points" });
      }

      member.total_points -= totalUsedPoints;
      await member.save();

      transaction.status = "paid";
      transaction.payment_method = "points";
      transaction.cash_paid = 0;
      transaction.change = 0;
      transaction.members_id = member.id;
      await transaction.save();

      return res.status(200).json({
        message: "Transaction paid using points successfully",
        transaction: {
          ...transaction.toJSON(),
          items: parsedItems,
        },
      });
    }

    // === Pembayaran CASH/E-WALLET ===
    const change = cash_paid - transaction.final_price;

    transaction.status = "paid";
    transaction.payment_method = payment_method || transaction.payment_method;
    transaction.cash_paid = cash_paid;
    transaction.change = change;

    let member = null;

    // Ambil member jika ada, baik dari transaksi atau dari identifier
    if (transaction.members_id) {
      member = await Member.findByPk(transaction.members_id);
    } else if (member_identifier) {
      member = await Member.findOne({
        where: {
          [Op.or]: [{ phone: member_identifier }, { email: member_identifier }],
        },
      });
      if (member) {
        transaction.members_id = member.id;
      }
    }

    // Tambahkan total belanja & poin loyalitas jika ada member dan bukan pembayaran dengan poin
    if (member) {
      member.total_spent += transaction.final_price;
      // Tambah point loyalti (misal: 1 point per 10.000 belanja)
      member.total_points += Math.floor(transaction.final_price / 10000);
      await member.save();
    }

    await transaction.save();

    return res.status(200).json({
      message: "Transaction marked as paid successfully",
      transaction: {
        ...transaction.toJSON(),
        change,
        items: parsedItems,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error updating transaction status",
      error: error.message,
    });
  }
};

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
        .json({ message: "Paid transactions cannot be canceled" });
    }

    await Transaction.destroy({ where: { id } });

    res.status(200).json({ message: "Transaction canceled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error canceling transaction", error: error.message });
  }
};
