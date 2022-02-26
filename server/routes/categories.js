import express from 'express';
import { addCategory, getAllCategories, toggleCategoryStatus, updateCategory } from '../controllers/categories.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { isAdmin } from '../middlewares/isAdmin.js';

const router = express.Router();

router.get('/categories', isLoggedIn, getAllCategories);
router.post('/categories', isLoggedIn, isAdmin, addCategory);
router.put('/categories', isLoggedIn, isAdmin, updateCategory);
router.post('/categories/togglestatus', isLoggedIn, isAdmin, toggleCategoryStatus);

export default router;
