import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Department from './Department.js';
import Login from './Login.js';

const Teacher = db.define(
  'Teacher',
  {
    teacher_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      type: DataTypes.ENUM('Prof', 'Asst.Prof', 'HOD'),
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

Teacher.Login = Teacher.belongsTo(Login, { foreignKey: 'username' });
Teacher.belongsTo(Department, { foreignKey: 'dept_id' });

try {
  await Teacher.sync();
  console.log('Teacher table (re)created');
} catch (error) {
  console.error('Unable to create teacher table : ', error);
}

export default Teacher;
