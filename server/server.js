import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/department.js';
import teacherRoutes from './routes/teachers.js';

const app = express();
const PORT = process.env.PORT || 4000;

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
app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api', authRoutes);
app.use('/api', departmentRoutes);
app.use('/api', teacherRoutes);

app.listen(PORT, console.log(`🚀 listening on port ${PORT}`));
