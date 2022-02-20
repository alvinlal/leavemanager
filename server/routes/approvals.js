import express from 'express';

import { changeApprovalStatus, getAllApprovals } from '../controllers/approvals.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isHOD } from '../middlewares/isHOD.js';

const router = express.Router();

router.get('/approvals', isLoggedIn, isHOD, getAllApprovals);
router.post('/changeapprovalstatus', isLoggedIn, isHOD, changeApprovalStatus);
export default router;
