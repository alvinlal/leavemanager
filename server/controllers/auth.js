import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Login from '../models/Login.js';

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Login.findOne({
      attributes: ['username', 'password', 'user_type'],
      where: { username: email },
    });

    if (!user) {
      return res.json({
        error: true,
        errmsg: 'Incorrect email or password',
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({
        error: true,
        errmsg: 'Incorrect email or password',
      });
    }

    const { username, user_type } = user;
    var name;

    switch (user_type) {
      case 'TEACHER': {
        var { firstname, lastname } = await Teacher.findOne({
          attributes: ['firstname', 'lastname'],
          where: { email },
        });
        name = firstname + ' ' + lastname;
        break;
      }
      case 'STAFF': {
        var { firstname, lastname } = await Staff.findOne({
          attributes: ['firstname', 'lastname'],
          where: { email },
        });
        name = firstname + ' ' + lastname;
        break;
      }
      case 'ADMIN': {
        name = 'Admin';
        break;
      }
    }

    const token = jwt.sign({ username, user_type, name }, process.env.JWT_SECRET, { expiresIn: '25 days' });

    res.cookie('token', token, { httpOnly: true, maxAge: 2160000000, secure: process.env.ENV == 'production' ? true : false });

    return res.json({
      error: false,
      user: {
        username,
        user_type,
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
