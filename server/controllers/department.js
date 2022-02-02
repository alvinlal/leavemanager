import Department from '../models/Department.js';

export const getAllDepartments = async (req, res) => {
  const departments = await Department.findAll({ attributes: ['dept_name', 'hod_id', 'dept_status'] });
  return res.json(departments);
};
