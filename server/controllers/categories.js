import Category from '../models/Category.js';

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    return res.json(categories);
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const addCategory = async (req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name,
      hasLimit: req.body.hasLimit,
      max_days_teacher: req.body.max_days_teacher,
      max_days_staff: req.body.max_days_staff,
    });

    return res.json({
      error: false,
      data: category,
    });
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      return res.json({
        error: {
          category_name: 'category already exists',
        },
      });
    }
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const updateCategory = async (req, res) => {
  try {
    await Category.update(
      {
        category_name: req.body.category_name,
        hasLimit: req.body.hasLimit,
        max_days_staff: req.body.hasLimit ? req.body.max_days_staff : 0,
        max_days_teacher: req.body.hasLimit ? req.body.max_days_teacher : 0,
      },
      { where: { category_id: req.body.category_id } }
    );

    const category = await Category.findByPk(req.body.category_id);

    return res.json({
      error: false,
      data: category,
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const toggleCategoryStatus = async (req, res) => {
  try {
    await Category.update(
      {
        category_status: req.body.current_category_status ? 0 : 1,
      },
      { where: { category_id: req.body.category_id } }
    );
    return res.json({
      error: false,
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};
