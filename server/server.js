import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from './logger/index.js';
import httpLogger from './middlewares/httpLogger.js';
import { isLoggedIn } from './middlewares/isLoggedIn.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import dashboardRoutes from './routes/dashboard.js';
import departmentRoutes from './routes/departments.js';
import teacherRoutes from './routes/teachers.js';
import staffRoutes from './routes/staffs.js';
import leaveRoutes from './routes/leaves.js';
import categoryRoutes from './routes/categories.js';
import approvalRoutes from './routes/approvals.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 4000;

// set root path
global.__basedir = dirname(fileURLToPath(import.meta.url));

// DB connection test
try {
  await db.authenticate();
  logger.info('DATABASE CONNECTED');
} catch (error) {
  logger.error(`Unable to establish connection to db : ${error.message}`);
}

// Middlewares
app.use(httpLogger);
app.use(
  cors({
    origin: process.env.ENV === 'development' ? 'http://localhost:3000' : 'https://www.leavemanager.co.in',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use('/public/uploads/slips', isLoggedIn);
app.use('/public', express.static('public'));

// routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', dashboardRoutes);
app.use('/', departmentRoutes);
app.use('/', teacherRoutes);
app.use('/', staffRoutes);
app.use('/', leaveRoutes);
app.use('/', categoryRoutes);
app.use('/', approvalRoutes);
app.use('/', reportRoutes);

// listen
app.listen(PORT, logger.info(`🚀 server listening on port ${PORT}`));
