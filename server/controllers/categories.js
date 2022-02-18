import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { category_status: 1 },
    });
    return res.json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
