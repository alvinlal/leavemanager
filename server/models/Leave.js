import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Login from './Login.js';
import Category from './Category.js';
import Teacher from './Teacher.js';

const Leave = db.define(
  'Leave',
  {
    leave_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    leave_startDate: {
      type: DataTypes.DATEONLY,
      required: true,
    },
    leave_endDate: {
      type: DataTypes.DATEONLY,
      required: true,
    },
    no_of_days: {
      type: DataTypes.SMALLINT,
      required: true,
    },
    leave_approval_status: {
      type: DataTypes.ENUM('approved', 'pending', 'declined'),
      defaultValue: 'pending',
    },
    leave_reason: {
      type: DataTypes.STRING,
      required: true,
    },
    leave_application_date: {
      type: DataTypes.DATEONLY,
      required: true,
    },
    leave_slip_image: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
  },
  {
    tableName: 'tbl_leave',
  }
);

Leave.Login = Leave.belongsTo(Login, { foreignKey: 'applicant_username' });
Leave.Category = Leave.belongsTo(Category, { foreignKey: 'category_id' });
Leave.Teacher = Leave.belongsTo(Teacher, { foreignKey: 'leave_approved_by', targetKey: 'username' });

try {
  await Leave.sync();
  console.log('Leave table (re)created');
} catch (error) {
  console.error('Unable to create leave table : ', error);
}

export default Leave;
