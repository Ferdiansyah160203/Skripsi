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

    // TODO: Calculate real growth from historical data instead of random
    // For now using 0 until historical data implementation
    const result = {
      totalSales: parseFloat(totalSales),
      salesGrowth: 0, // TODO: Calculate from previous period
      totalOrders,
      ordersGrowth: 0, // TODO: Calculate from previous period
      totalMembers,
      membersGrowth: 0, // TODO: Calculate from previous period
      totalMemberPoints: parseInt(totalMemberPoints),
      pointsGrowth: 0, // TODO: Calculate from previous period
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
    // Alternative approach: Query TransactionProduct with Product data separately
    const topProductsRaw = await TransactionProduct.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity_sold")), "total_sold"],
      ],
      group: ["product_id"],
      order: [[Sequelize.fn("SUM", Sequelize.col("quantity_sold")), "DESC"]],
      limit: 5,
      raw: true,
    });

    // Get product details for each top selling product
    const topProducts = [];
    for (const item of topProductsRaw) {
      const product = await Product.findByPk(item.product_id, {
        attributes: ["id", "name", "price"],
      });

      if (product) {
        topProducts.push({
          id: product.id,
          name: product.name || "Unknown Product",
          price: parseFloat(product.price) || 0,
          sold_quantity: parseInt(item.total_sold) || 0,
          growth: 0, // TODO: Calculate from historical data
        });
      }
    }

    res.json(topProducts);
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
    // Get current date in Indonesia timezone (UTC+7)
    const now = new Date();
    const indonesiaOffset = 7 * 60; // UTC+7 in minutes
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const indonesiaTime = new Date(utcTime + indonesiaOffset * 60000);

    // Set dates in Indonesia timezone
    const today = new Date(
      indonesiaTime.getFullYear(),
      indonesiaTime.getMonth(),
      indonesiaTime.getDate()
    );
    const endDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 29,
      0,
      0,
      0
    );

    console.log("Date range for daily sales (Indonesia timezone):", {
      indonesiaTime: indonesiaTime.toISOString(),
      today: today.toISOString(),
      todayDate: today.getDate(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    // Query untuk mendapatkan data penjualan harian dari Transaction
    // Convert database timestamps to Indonesia timezone for date grouping
    const dailySales = await Transaction.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DATE",
            Sequelize.fn(
              "CONVERT_TZ",
              Sequelize.col("createdAt"),
              "+00:00",
              "+07:00"
            )
          ),
          "date",
        ],
        [Sequelize.fn("SUM", Sequelize.col("final_price")), "totalSales"],
      ],
      where: {
        status: "paid", // Hanya transaksi yang sudah dibayar
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [
        Sequelize.fn(
          "DATE",
          Sequelize.fn(
            "CONVERT_TZ",
            Sequelize.col("createdAt"),
            "+00:00",
            "+07:00"
          )
        ),
      ],
      order: [
        [
          Sequelize.fn(
            "DATE",
            Sequelize.fn(
              "CONVERT_TZ",
              Sequelize.col("createdAt"),
              "+00:00",
              "+07:00"
            )
          ),
          "ASC",
        ],
      ],
      raw: true,
    });

    console.log("Raw daily sales data:", dailySales);

    // Create a map of existing sales data
    const salesMap = {};
    dailySales.forEach((item) => {
      salesMap[item.date] = parseFloat(item.totalSales) || 0;
    });

    // Generate complete 30-day data with zeros for missing days
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      // Use Indonesia timezone for consistent date calculation
      const date = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - i
      );
      const dateStr = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const dayNumber = date.getDate();

      chartData.push({
        day: dayNumber.toString(),
        date: dateStr, // Include full date for debugging
        sales: salesMap[dateStr] || 0,
      });
    }

    console.log("Final chart data (last 3 days):", chartData.slice(-3));
    console.log(
      "Today should be day:",
      today.getDate(),
      "Current data shows last day:",
      chartData[chartData.length - 1]?.day
    );

    res.json(chartData);
  } catch (error) {
    console.error("Error fetching daily sales:", error);
    res.status(500).json({ message: "Error fetching daily sales" });
  }
};

// Get products data for dashboard table
export const getDashboardProducts = async (req, res) => {
  try {
    // Get products with their materials in one query using include
    const products = await Product.findAll({
      attributes: ["id", "name", "price", "category", "createdAt"],
      include: [
        {
          model: ProductMaterial,
          as: "ProductMaterials", // Use the alias defined in associations
          attributes: ["inventories_id", "quantity_used"],
          include: [
            {
              model: InventoryModel,
              as: "inventory", // Use the alias defined in associations
              attributes: ["stock"],
            },
          ],
          required: false, // Left join to include products without materials
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedProducts = products.map((product) => {
      let isAvailable = true;

      // Check if product has materials and if all materials are available
      if (product.ProductMaterials && product.ProductMaterials.length > 0) {
        for (const material of product.ProductMaterials) {
          const requiredQuantity = material.quantity_used;
          const availableStock = material.inventory?.stock || 0;

          if (availableStock < requiredQuantity) {
            isAvailable = false;
            break;
          }
        }
      }

      return {
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        category: product.category,
        status: isAvailable ? "Tersedia" : "Habis",
        createdAt: product.createdAt,
        materialsCount: product.ProductMaterials?.length || 0,
      };
    });

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
