import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ProductMaterial = db.define("productmaterial", {
  quantity_used: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default ProductMaterial;
