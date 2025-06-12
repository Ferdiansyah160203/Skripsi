import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import InventoryModel from "./InventoriesModel.js";

const { DataTypes } = Sequelize;

const StockOpname = db.define(
  "stockopname",
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
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: "stockopnames",
    timestamps: true,
  }
);

// Relasi
StockOpname.belongsTo(InventoryModel, { foreignKey: "inventories_id" });
InventoryModel.hasMany(StockOpname, { foreignKey: "inventories_id" });

export default StockOpname;
