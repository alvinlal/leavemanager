import express from 'express';
import { getUserDetails, updateUserDetails } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/user/details', isLoggedIn, getUserDetails);
router.put('/user/details', isLoggedIn, updateUserDetails);

export default router;
