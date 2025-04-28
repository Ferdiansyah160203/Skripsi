import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Member from "./MemberModel.js";

const Sale = db.define("Sale", {
  total_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount_amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  final_amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING, // example: 'paid', 'unpaid', 'cancelled'
    allowNull: false,
  },
});

// Relasi
Sale.belongsTo(Member, { foreignKey: "member_id" });
Member.hasMany(Sale, { foreignKey: "member_id" });

export default Sale;
