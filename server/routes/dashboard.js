import express from 'express';

import { getDashBoardData } from '../controllers/dashboard.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/dashboard', isLoggedIn, getDashBoardData);

export default router;
