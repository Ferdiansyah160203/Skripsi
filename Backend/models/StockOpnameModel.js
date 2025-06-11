import { Model, DataTypes } from "sequelize";
import db from "../config/Database.js";
import InventoryModel from "./InventoriesModel.js";

class StockOpname extends Model {}

StockOpname.init(
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
      // tambahkan field ini
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "StockOpname",
    tableName: "stockopnames",
    timestamps: true,
  }
);

// Relasi
StockOpname.belongsTo(InventoryModel, { foreignKey: "inventories_id" });
InventoryModel.hasMany(StockOpname, { foreignKey: "inventories_id" });

export default StockOpname;
