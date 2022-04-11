import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Category = db.define(
  'Category',
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_name: {
      type: DataTypes.STRING,
      required: true,
      unique: true,
    },
    // add total no of days to tbl_leave
    hasLimit: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    max_days_teacher: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      required: true,
    },
    max_days_staff: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      required: true,
    },
    category_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
  },
  {
    tableName: 'tbl_category',
    timestamps: false,
  }
);

try {
  await Category.sync();
  global.logger.info('Category table (re)created');
} catch (error) {
  global.logger.error(`Unable to create category table: ${error.message}`);
}

export default Category;
