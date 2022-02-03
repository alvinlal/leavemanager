import express from 'express';
import { addDepartment, getAllDepartments, toggleDepartmentStatus } from '../controllers/department.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/departments', isLoggedIn, isAdmin, getAllDepartments);
router.post('/departments', isLoggedIn, isAdmin, addDepartment);
router.post('/departments/togglestatus', isLoggedIn, isAdmin, toggleDepartmentStatus);

export default router;
