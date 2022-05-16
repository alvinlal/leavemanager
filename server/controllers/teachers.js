import { Op } from 'sequelize';
import Department from '../models/Department.js';
import Teacher from '../models/Teacher.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: [
        'teacher_id',
        'username',
        'teacher_firstname',
        'teacher_lastname',
        'teacher_designation',
        'teacher_status',
        'dept_id',
      ],
      include: [{ model: Department, attributes: ['dept_name'] }],
    });
    return res.json(teachers);
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const addTeacher = async (req, res) => {
  const randomPassword = crypto.randomBytes(6).toString('hex');
  const hashedpassword = await bcrypt.hash(randomPassword, 10);
  try {
    if (req.body.teacher_designation == 'HOD') {
      const hodExists = await Teacher.count({ where: { dept_id: req.body.dept_id, teacher_designation: 'HOD' } });
      if (hodExists) {
        return res.json({
          error: {
            hod: 'HOD already exists for this department !',
          },
        });
      }
    }
    const { username, teacher_id, dept_id, teacher_firstname, teacher_lastname, teacher_designation, teacher_status } =
      await Teacher.create(
        {
          username: req.body.username,
          dept_id: req.body.dept_id,
          teacher_firstname: req.body.teacher_firstname,
          teacher_lastname: req.body.teacher_lastname,
          teacher_designation: req.body.teacher_designation,
          Login: {
            username: req.body.username,
            user_type: 'TEACHER',
            password: hashedpassword,
          },
        },
        {
          include: [
            { model: Department, attributes: ['dept_name'] },
            {
              association: Teacher.Login,
            },
          ],
        }
      );
    // send as SES mail with the password here
    return res.json({
      error: false,
      data: {
        teacher_id,
        username,
        password: randomPassword,
        dept_id,
        Department: {
          dept_name: req.body.dept_name,
        },
        teacher_firstname,
        teacher_lastname,
        teacher_designation,
        teacher_status,
      },
    });
  } catch (error) {
    if (error.name == 'SequelizeUniqueConstraintError') {
      return res.json({
        error: {
          username: 'Email already exists !',
        },
      });
    }
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const updateTeacher = async (req, res) => {
  try {
    if (req.body.teacher_designation == 'HOD') {
      const hodExists = await Teacher.count({
        where: {
          teacher_id: {
            [Op.not]: req.body.teacher_id,
          },
          dept_id: req.body.dept_id,
          teacher_designation: 'HOD',
        },
      });
      console.log(hodExists);
      if (hodExists) {
        return res.json({
          error: {
            hod: 'HOD already exists for this department !',
          },
        });
      }
    }
    await Teacher.update(
      {
        teacher_firstname: req.body.teacher_firstname,
        teacher_lastname: req.body.teacher_lastname,
        dept_id: req.body.dept_id,
        teacher_designation: req.body.teacher_designation,
      },
      { where: { teacher_id: req.body.teacher_id } }
    );

    const { teacher_firstname, teacher_lastname, dept_id, teacher_designation, teacher_id } = await Teacher.findByPk(
      req.body.teacher_id,
      {
        attributes: ['teacher_firstname', 'teacher_lastname', 'dept_id', 'teacher_designation', 'teacher_id'],
      }
    );

    return res.json({
      error: false,
      data: { teacher_id, dept_id, teacher_firstname, teacher_lastname, teacher_designation },
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};

export const toggleTeacherStatus = async (req, res) => {
  try {
    await Teacher.update(
      { teacher_status: req.body.current_teacher_status ? 0 : 1 },
      { where: { teacher_id: req.body.teacher_id } }
    );
    return res.json({
      error: false,
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('internal server error');
  }
};
