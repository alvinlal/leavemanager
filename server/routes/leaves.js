import express from 'express';

import { getAllLeaves, addLeave, updateLeave } from '../controllers/leaves.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/leaves', isLoggedIn, getAllLeaves);
router.post('/leaves', isLoggedIn, addLeave);
router.put('/leaves', isLoggedIn, updateLeave);

export default router;
