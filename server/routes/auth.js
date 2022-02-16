import express from 'express';
import { me, login, logout } from '../controllers/auth.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/me', isLoggedIn, me);
router.post('/login', login);
router.get('/logout', logout);

export default router;
