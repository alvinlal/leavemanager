import express from 'express';

import { getAllStaffs, addStaff, updateStaff, toggleStaffStatus } from '../controllers/staffs.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/staffs', isLoggedIn, isAdmin, getAllStaffs);
router.post('/staffs', isLoggedIn, isAdmin, addStaff);
router.put('/staffs', isLoggedIn, isAdmin, updateStaff);
router.post('/staffs/togglestatus', isLoggedIn, isAdmin, toggleStaffStatus);

export default router;
