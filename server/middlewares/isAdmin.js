export const isAdmin = (req, res, next) => {
  if (req.user.user_type !== 'ADMIN') {
    return res.status(401).json({
      error: 'unauthorized',
    });
  }
  next();
};
