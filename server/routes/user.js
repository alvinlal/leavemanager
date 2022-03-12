import express from 'express';
import { getUserDetails, updateUserDetails, changePassword } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/user/details', isLoggedIn, getUserDetails);
router.put('/user/details', isLoggedIn, updateUserDetails);
router.put('/user/changepassword', isLoggedIn, changePassword);

export default router;
