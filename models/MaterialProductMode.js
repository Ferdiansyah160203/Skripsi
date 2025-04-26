import { DataTypes } from 'sequelize';
import db from '../config/Database.js';

const Material = db.define('materials', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  stock: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pcs', // contoh: gram, liter, pcs, dll
  }
});

export default Material;
