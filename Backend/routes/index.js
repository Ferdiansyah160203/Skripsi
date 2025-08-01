import express from "express";
import userRoutes from "./UserRoute.js";
import Inventory from "./InventoriesRoute.js";
import Product from "./ProductRoute.js";
import TransactionRoute from "./TransactionRoute.js";
import MemberRoute from "./MemberRoute.js";
import PromoRoute from "./PromoRoute.js";
import StockOpname from "./StockRoute.js";
import FileRoute from "./FileRoute.js";
import DashboardRoute from "./DashboardRoute.js";
import PurchaseRoute from "./PurchaseRoute.js";
const router = express.Router();

router.use("/api/transactions", TransactionRoute);
router.use("/api/inventories", Inventory);
router.use("/api/users", userRoutes);
router.use("/api/products", Product);
router.use("/api/members", MemberRoute);
router.use("/api/stock-opnames", StockOpname);
router.use("/api/promos", PromoRoute);
router.use("/api/files", FileRoute);
router.use("/api/dashboard", DashboardRoute);
router.use("/api/purchases", PurchaseRoute);

export default router;
