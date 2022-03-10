import express from 'express';
import {
  addDepartment,
  getAllDepartments,
  toggleDepartmentStatus,
  updateDepartment,
} from '../controllers/departments.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/departments', isLoggedIn, getAllDepartments);
router.post('/departments', isLoggedIn, isAdmin, addDepartment);
router.put('/departments', isLoggedIn, isAdmin, updateDepartment);
router.post('/departments/togglestatus', isLoggedIn, isAdmin, toggleDepartmentStatus);

export default router;
