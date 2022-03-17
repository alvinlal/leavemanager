import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const dbname = process.env.DB_NAME;
const dbuser = process.env.DB_USER;
const dbpass = process.env.DB_PASSWORD;
const dbhost = process.env.DB_HOST;
const dbdialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbname, dbuser, dbpass, {
  host: dbhost,
  dialect: dbdialect,
  dialectOptions: {
    multipleStatements: true,
  },
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
