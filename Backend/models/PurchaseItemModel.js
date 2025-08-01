import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const PurchaseItem = db.define(
  "purchase_item",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    purchase_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "purchase",
        key: "id",
      },
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "inventories",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default PurchaseItem;
