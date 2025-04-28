import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const InventoryModel = db.define("inventories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
});

export default InventoryModel;
