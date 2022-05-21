import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  if (!req.cookies.token) {
    return res.json({ isLoggedIn: false });
  }
  try {
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const { username, user_type, name, isHOD, doj } = user;
    req.user = { username, user_type, name, ...(isHOD && { isHOD }), ...(doj && { doj }) };
  } catch (error) {
    return res.status(401).json({ isLoggedIn: false });
  }
  next();
};
