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
  global.logger.info('Login table (re)created');
} catch (error) {
  global.logger.error(`Unable to create login table: ${error.message}`);
}

export default Login;
