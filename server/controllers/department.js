import Department from '../models/Department.js';

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      attributes: ['dept_id', 'dept_name', 'dept_status'],
    });
    return res.json(departments);
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const addDepartment = async (req, res) => {
  try {
    const { dept_id, dept_name, dept_status } = await Department.create({
      dept_name: req.body.dept_name,
    });
    return res.json({
      error: false,
      data: { dept_id, dept_name, dept_status },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const updateDepartment = async (req, res) => {
  try {
    await Department.update(
      { dept_name: req.body.dept_name },
      { where: { dept_id: req.body.dept_id } }
    );
    const { dept_name, dept_id } = await Department.findByPk(req.body.dept_id, {
      attributes: ['dept_name', 'dept_id'],
    });

    return res.json({
      error: false,
      data: { dept_name, dept_id },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};

export const toggleDepartmentStatus = async (req, res) => {
  try {
    await Department.update(
      { dept_status: req.body.current_dept_status ? 0 : 1 },
      { where: { dept_id: req.body.dept_id } }
    );
    return res.json({
      error: false,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
