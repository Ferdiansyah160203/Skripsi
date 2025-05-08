import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Product from "./ProductModel.js";

const { DataTypes } = Sequelize;

const PointPromo = db.define(
  "point_promo",
  {
    point_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);

PointPromo.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(PointPromo, { foreignKey: "product_id" });

export default PointPromo;
