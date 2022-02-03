import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Teacher = db.define(
  'Teacher',
  {
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      references: {
        model: 'tbl_login',
        key: 'username',
      },
    },
    dept_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'tbl_department',
        key: 'dept_id',
      },
    },
    teacher_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher_designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacher_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    tableName: 'tbl_teacher',
  }
);

try {
  await Teacher.sync();
  console.log('Teacher table (re)created');
} catch (error) {
  console.error('Unable to create teacher table : ', error);
}

export default Teacher;
