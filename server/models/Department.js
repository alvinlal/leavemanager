import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Department = db.define(
  'Department',
  {
    dept_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dept_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dept_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    tableName: 'tbl_department',
    timestamps: false,
  }
);

try {
  await Department.sync();
  console.log('Department table (re)created');
} catch (error) {
  console.error('Unable to create department table : ', error);
}

export default Department;
