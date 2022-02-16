import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Login = db.define(
  'Login',
  {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    user_type: {
      type: DataTypes.ENUM('ADMIN', 'TEACHER', 'STAFF'),
      allowNull: false,
    },
    haschangedpass: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'tbl_login',
  }
);

try {
  await Login.sync();
  console.log('Login table (re)created');
} catch (error) {
  console.error('Unable to create login table : ', error);
}

export default Login;
