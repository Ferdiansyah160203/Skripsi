import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Inventory from "./InventoryModel.js";

const StockOpname = db.define("StockOpname", {
  actual_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  recorded_stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  difference: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Relasi
StockOpname.belongsTo(Inventory, { foreignKey: "inventory_id" });
Inventory.hasMany(StockOpname, { foreignKey: "inventory_id" });

export default StockOpname;
