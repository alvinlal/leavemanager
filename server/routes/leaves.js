import express from 'express';

import { getAllLeaves, addLeave } from '../controllers/leaves.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/leaves', isLoggedIn, getAllLeaves);
router.post('/leaves', isLoggedIn, addLeave);

export default router;
