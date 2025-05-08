import express from "express";
import userRoutes from "./UserRoute.js";
import Inventory from "./InventoriesRoute.js";
import Product from "./ProductRoute.js";
import TransactionRoute from "./TransactionRoute.js";
import MemberRoute from "./MemberRoute.js";
import PromoRoute from "./PromoRoute.js";
import StockOpname from "../models/StockOpnameModel.js";
const router = express.Router();

router.use("/api/transactions", TransactionRoute);
router.use("/api/inventories", Inventory);
router.use("/api/users", userRoutes);
router.use("/api/products", Product);
router.use("/api/members", MemberRoute);
router.use("/api/stock-opnames", StockOpname);
router.use("/api/promos", PromoRoute);

export default router;
