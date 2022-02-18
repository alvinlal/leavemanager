import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import teacherRoutes from './routes/teachers.js';
import leaveRoutes from './routes/leaves.js';
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = process.env.PORT || 4000;

// set root path
global.__basedir = dirname(fileURLToPath(import.meta.url));

// DB connection test
try {
  await db.authenticate();
  console.log('DATABASE CONNECTED');
} catch (error) {
  console.error('Unable to connect to database : ', error);
}

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api', authRoutes);
app.use('/api', departmentRoutes);
app.use('/api', teacherRoutes);
app.use('/api', leaveRoutes);
app.use('/api', categoryRoutes);

app.listen(PORT, console.log(`🚀 listening on port ${PORT}`));
