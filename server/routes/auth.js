import express from 'express';
import { me, login } from '../controllers/auth.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/me', isLoggedIn, me);
router.post('/login', login);

export default router;
