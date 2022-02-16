import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Login from '../models/Login.js';
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
    var isHOD = false;

    switch (user_type) {
      case 'TEACHER': {
        var { teacher_firstname, teacher_lastname, teacher_designation } = await Teacher.findOne({
          attributes: ['teacher_firstname', 'teacher_lastname', 'teacher_designation'],
          where: { username: email },
        });
        if (teacher_designation === 'HOD') {
          isHOD = true;
        }
        name = teacher_firstname + ' ' + teacher_lastname;
        break;
      }
      case 'STAFF': {
        var { staff_firstname, staff_lastname } = await Staff.findOne({
          attributes: ['staff_firstname', 'staff_lastname'],
          where: { username: email },
        });
        name = staff_firstname + ' ' + staff_lastname;
        break;
      }
      case 'ADMIN': {
        name = 'Admin';
        break;
      }
    }

    const token = jwt.sign({ username, user_type, name, ...(isHOD && isHOD) }, process.env.JWT_SECRET, {
      expiresIn: '25 days',
    });

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
        ...(isHOD && isHOD),
        name,
        isLoggedIn: true,
      },
    });
  } catch (error) {
    console.error('Cannot query db : ', error);
    return res.status(500).send('Internal Server error');
  }
};

export const me = (req, res) => {
  if (!req.user) {
    return res.json({ isLoggedIn: false });
  }
  const { username, user_type, name } = req.user;
  return res.json({ username, user_type, name, isLoggedIn: true });
};
