import express from 'express';

import { getReport, getReportByUsername } from '../controllers/reports.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/reports', isLoggedIn, isAdmin, getReport);
router.get('/reports/:username', isLoggedIn, isAdmin, getReportByUsername);

export default router;
