import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Login from '../models/Login.js';
import Staff from '../models/Staff.js';
import Teacher from '../models/Teacher.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({
      attributes: ['username', 'password', 'user_type'],
      where: { username: email },
    });

    if (!user) {
      return res.json({
        error: 'Incorrect email or password',
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        error: 'Incorrect email or password',
      });
    }

    const { username, user_type } = user;
    var name;
    var doj = null;
    var isHOD = false;

    switch (user_type) {
      case 'TEACHER': {
        var { teacher_firstname, teacher_lastname, teacher_designation, teacher_doj, teacher_status } =
          await Teacher.findOne({
            attributes: [
              'teacher_firstname',
              'teacher_lastname',
              'teacher_designation',
              'teacher_doj',
              'teacher_status',
            ],
            where: { username: email },
          });

        if (!teacher_status) {
          return res.json({
            error: 'Incorrect email or password',
          });
        }

        if (teacher_designation === 'HOD') {
          isHOD = true;
        }
        name = teacher_firstname + ' ' + teacher_lastname;
        doj = teacher_doj;
        break;
      }
      case 'STAFF': {
        var { staff_firstname, staff_lastname, staff_doj, staff_status } = await Staff.findOne({
          attributes: ['staff_firstname', 'staff_lastname', 'staff_status', 'staff_doj'],
          where: { username: email },
        });
        if (!staff_status) {
          return res.json({
            error: 'Incorrect email or password',
          });
        }
        name = staff_firstname + ' ' + staff_lastname;
        doj = staff_doj;
        break;
      }
      case 'ADMIN': {
        name = 'Admin';
        break;
      }
    }

    const token = jwt.sign(
      { username, user_type, name, ...(doj && { doj }), ...(isHOD && { isHOD }) },
      process.env.JWT_SECRET,
      {
        expiresIn: '25 days',
      }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 2160000000,
      secure: process.env.ENV == 'production' ? true : false,
    });

    return res.json({
      error: false,
      data: {
        username,
        user_type,
        ...(isHOD && { isHOD }),
        ...(doj && { doj }),
        name,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    global.logger.error(`${error.message} ${error.stack}`);
    return res.status(500).send('Internal Server error');
  }
};

export const me = (req, res) => {
  if (!req.user) {
    return res.json({ isLoggedIn: false });
  }
  const { username, user_type, name, isHOD, doj } = req.user;
  return res.json({ username, user_type, name, isLoggedIn: true, ...(doj && { doj }), ...(isHOD && { isHOD }) });
};

export const logout = (req, res) => {
  res.clearCookie('token');
  return res.json({
    success: true,
  });
};
