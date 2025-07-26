import { Sequelize, Op } from "sequelize";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Member from "../models/MemberModel.js";
import Transaction from "../models/TransactionModel.js";
import TransactionProduct from "../models/TransactionProductModel.js";
import InventoryModel from "../models/InventoriesModel.js";
import ProductMaterial from "../models/ProductMaterialModel.js";

// Get dashboard summary data (cards)
export const getDashboardSummary = async (req, res) => {
  try {
    // Total Sales (total revenue from transactions) - using final_price which includes discounts
    const totalSales = (await Transaction.sum("final_price")) || 0;

    // Total Orders (total transactions)
    const totalOrders = await Transaction.count();

    // Total Members
    const totalMembers = await Member.count();

    // Total Member Points
    const totalMemberPoints = (await Member.sum("total_points")) || 0;

    const result = {
      totalSales: parseFloat(totalSales),
      salesGrowth: Math.floor(Math.random() * 10) - 2, // Random growth between -2% and 8%
      totalOrders,
      ordersGrowth: Math.floor(Math.random() * 8) - 3, // Random growth between -3% and 5%
      totalMembers,
      membersGrowth: Math.floor(Math.random() * 12) - 1, // Random growth between -1% and 11%
      totalMemberPoints: parseInt(totalMemberPoints),
      pointsGrowth: Math.floor(Math.random() * 15) + 1, // Random growth between 1% and 16%
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

// Get top selling products
export const getTopSellingProducts = async (req, res) => {
  try {
    // Query untuk mendapatkan produk terlaris dari TransactionProduct
    const topProducts = await TransactionProduct.findAll({
      attributes: [
        [Sequelize.col("Product.id"), "id"],
        [Sequelize.col("Product.name"), "name"],
        [Sequelize.col("Product.price"), "price"],
        [Sequelize.fn("SUM", Sequelize.col("quantity_sold")), "sold_quantity"],
      ],
      include: [
        {
          model: Product,
          attributes: [],
          required: true,
        },
      ],
      group: ["Product.id", "Product.name", "Product.price"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity_sold")), "DESC"]],
      limit: 5,
      raw: true,
    });

    const formattedProducts = topProducts.map((item) => ({
      id: item.id,
      name: item.name || "Unknown Product",
      price: parseFloat(item.price) || 0,
      sold_quantity: parseInt(item.sold_quantity) || 0,
      growth: Math.floor(Math.random() * 20) - 5,
    }));

    // Jika tidak ada data transaksi, return empty array
    if (formattedProducts.length === 0) {
      return res.json([]);
    }

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    res.status(500).json({
      message: "Error fetching top selling products",
      error: error.message,
    });
  }
};

// Get monthly sales data for chart
export const getMonthlySales = async (req, res) => {
  try {
    // Query untuk mendapatkan data penjualan bulanan dari Transaction
    const monthlySales = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("SUM", Sequelize.col("final_price")), "totalSales"],
      ],
      where: {
        status: "paid", // Hanya transaksi yang sudah dibayar
      },
      group: [
        Sequelize.fn("YEAR", Sequelize.col("createdAt")),
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
      ],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "ASC"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "ASC"],
      ],
      raw: true,
    });

    // Format data untuk chart
    let chartData = monthlySales.map((item) => ({
      month: getMonthName(item.month),
      year: item.year,
      sales: parseFloat(item.totalSales) || 0,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching monthly sales:", error);
    res.status(500).json({ message: "Error fetching monthly sales" });
  }
};

// Get daily sales data for chart
export const getDailySales = async (req, res) => {
  try {
    // Get current date and 30 days ago
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days

    // Query untuk mendapatkan data penjualan harian dari Transaction
    const dailySales = await Transaction.findAll({
      attributes: [
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "date"],
        [Sequelize.fn("SUM", Sequelize.col("final_price")), "totalSales"],
      ],
      where: {
        status: "paid", // Hanya transaksi yang sudah dibayar
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
      order: [[Sequelize.fn("DATE", Sequelize.col("createdAt")), "ASC"]],
      raw: true,
    });

    // Create a map of existing sales data
    const salesMap = {};
    dailySales.forEach((item) => {
      salesMap[item.date] = parseFloat(item.totalSales) || 0;
    });

    // Generate complete 30-day data with zeros for missing days
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      chartData.push({
        day: date.getDate().toString(),
        sales: salesMap[dateStr] || 0,
      });
    }

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({ message: "Error fetching daily sales" });
  }
};

// Get products data for dashboard table
export const getDashboardProducts = async (req, res) => {
  try {
    // Get products data
    const products = await Product.findAll({
      attributes: ["id", "name", "price", "category", "createdAt"],

      order: [["createdAt", "DESC"]],
    });

    const formattedProducts = [];

    for (const product of products) {
      // Manual query untuk ProductMaterial
      const productMaterials = await ProductMaterial.findAll({
        where: { product_id: product.id },
        attributes: ["inventories_id", "quantity_used"],
      });

      let isAvailable = true;

      for (const material of productMaterials) {
        const inventory = await InventoryModel.findByPk(
          material.inventories_id
        );
        const requiredQuantity = material.quantity_used;
        const availableStock = inventory ? inventory.stock : 0;

        if (availableStock < requiredQuantity) {
          isAvailable = false;
          break;
        }
      }

      if (productMaterials.length === 0) {
        isAvailable = true;
      }

      formattedProducts.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        category: product.category,
        status: isAvailable ? "Tersedia" : "Habis",
        createdAt: product.createdAt,
        materialsCount: productMaterials.length,
      });
    }

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error in getDashboardProducts:", error);
    res.status(500).json({
      message: "Error fetching dashboard products",
      error: error.message,
    });
  }
};

// Get stock data for dashboard
export const getDashboardStocks = async (req, res) => {
  try {
    // Ambil data langsung dari Inventories (daftar bahan mentah/raw materials)
    const stocks = await InventoryModel.findAll({
      attributes: ["id", "name", "stock", "createdAt"],

      order: [["createdAt", "DESC"]],
    });

    const formattedStocks = stocks.map((inventory) => ({
      id: inventory.id,
      name: inventory.name || `Inventory #${inventory.id}`,
      stock: inventory.stock,
      status: inventory.stock <= 10 ? "Restok" : "Aman", // Threshold untuk status restok
      createdAt: inventory.createdAt,
    }));

    res.json(formattedStocks);
  } catch (error) {
    console.error("Error fetching dashboard stocks:", error);
    res.status(500).json({
      message: "Error fetching dashboard stocks",
      error: error.message,
    });
  }
};

// Helper function to get month name
function getMonthName(monthNumber) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthNumber - 1] || "Unknown";
}
