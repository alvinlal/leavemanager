import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    return res.json({ isLoggedIn: false });
  }
  try {
    const { username, user_type, name } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    req.user = { username, user_type, name };
  } catch (error) {
    return res.json({ isLoggedIn: false });
  }
  next();
};
