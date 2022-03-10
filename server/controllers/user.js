import Department from '../models/Department.js';
import Staff from '../models/Staff.js';
import Teacher from '../models/Teacher.js';

export const getUserDetails = async (req, res) => {
  try {
    const userModel = req.user.user_type === 'TEACHER' ? Teacher : Staff;

    const user = await userModel.findOne({
      where: { username: req.user.username },
      ...(req.user.user_type === 'TEACHER' && {
        include: { model: Department, attributes: ['dept_name'], where: { dept_status: 1 } },
      }),
    });
    return res.json({
      firstname: user.teacher_firstname ? user.teacher_firstname : user.staff_firstname,
      lastname: user.teacher_lastname ? user.teacher_lastname : user.staff_lastname,
      designation: user.teacher_designation ? user.teacher_designation : user.staff_designation,
      ...(req.user.user_type === 'TEACHER' && { dept_name: user.Department.dept_name }),
      ...(user.dept_id && { dept_id: user.dept_id }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server errror');
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const userModel = req.user.user_type === 'TEACHER' ? Teacher : Staff;
    await userModel.update(
      req.user.user_type === 'TEACHER'
        ? {
            teacher_firstname: req.body.firstname,
            teacher_lastname: req.body.lastname,
            teacher_designation: req.body.designation,
            dept_id: req.body.dept_id,
          }
        : {
            staff_firstname: req.body.firstname,
            staff_lastname: req.body.lastname,
            staff_designation: req.body.designation,
          },
      { where: { username: req.user.username } }
    );

    const user = await userModel.findOne({
      where: { username: req.user.username },
      ...(req.user.user_type === 'TEACHER' && {
        include: { model: Department, attributes: ['dept_name'], where: { dept_status: 1 } },
      }),
    });
    return res.json({
      error: false,
      data: {
        firstname: user.teacher_firstname ? user.teacher_firstname : user.staff_firstname,
        lastname: user.teacher_lastname ? user.teacher_lastname : user.staff_lastname,
        designation: user.teacher_designation ? user.teacher_designation : user.staff_designation,
        ...(req.user.user_type === 'TEACHER' && { dept_name: user.Department.dept_name }),
        ...(user.dept_id && { dept_id: user.dept_id }),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('internal server error');
  }
};
