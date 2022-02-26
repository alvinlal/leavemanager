import { DataTypes } from 'sequelize';
import db from '../config/db.js';
import Login from './Login.js';

const Staff = db.define(
  'Staff',
  {
    staff_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    staff_firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_designation: {
      type: DataTypes.ENUM('Accountant', 'Administrator', 'Clerk', 'Librarian'),
      allowNull: false,
    },
    staff_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    tableName: 'tbl_staff',
  }
);

Staff.Login = Staff.belongsTo(Login, { foreignKey: 'username' });

try {
  await Staff.sync();
  console.log('Staff table (re)created');
} catch (error) {
  console.error('Unable to create staff table : ', error);
}

export default Staff;
