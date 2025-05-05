import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import InventoryModel from "./InventoriesModel.js";

const { DataTypes } = Sequelize;

const StockOpname = db.define(
  "StockOpname",
  {
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
  },
  {
    timestamps: true,
  }
);

// Relasi
StockOpname.belongsTo(InventoryModel, { foreignKey: "inventories_id" });
InventoryModel.hasMany(StockOpname, { foreignKey: "inventories_id" });

export default StockOpname;
