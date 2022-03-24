import jwt from 'jsonwebtoken';

export const isLoggedIn = (req, res, next) => {
  console.log(req.cookies);
  if (!req.cookies.token) {
    return res.json({ isLoggedIn: false });
  }
  try {
    const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    const { username, user_type, name, isHOD } = user;
    req.user = { username, user_type, name, ...(isHOD && { isHOD }) };
  } catch (error) {
    return res.json({ isLoggedIn: false });
  }
  next();
};
