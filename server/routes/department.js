import express from 'express';
import { getAllDepartments } from '../controllers/department.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/departments', isLoggedIn, isAdmin, getAllDepartments);

export default router;
