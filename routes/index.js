import express from "express";
import userRoutes from "./UserRoute.js";
import Inventory from "./InventoriesRoute.js";
import Product from "./ProductRoute.js";
const router = express.Router();

router.use("/api/inventories", Inventory);
router.use("/api/users", userRoutes);
router.use("/api/products", Product);

export default router;
