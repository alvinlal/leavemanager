import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Department = db.define(
  'Department',
  {
    dept_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    hod_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tbl_teacher',
        key: 'teacher_id',
      },
    },
    dept_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dept_status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
    },
  },
  {
    tableName: 'tbl_department',
  }
);

try {
  await Department.sync();
  console.log('Department table (re)created');
} catch (error) {
  console.error('Unable to create department table : ', error);
}

export default Department;
