import express from 'express';

import { getAllTeachers, addTeacher, toggleTeacherStatus, updateTeacher } from '../controllers/teachers.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/teachers', isLoggedIn, isAdmin, getAllTeachers);
router.post('/teachers', isLoggedIn, isAdmin, addTeacher);
router.put('/teachers', isLoggedIn, isAdmin, updateTeacher);
router.post('/teachers/togglestatus', isLoggedIn, isAdmin, toggleTeacherStatus);

export default router;
