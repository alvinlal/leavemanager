import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    return res.json({ isLoggedIn: false });
  }
  try {
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  } catch (error) {
    return res.json({ isLoggedIn: false });
  }
  next();
};
