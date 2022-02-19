export const isHOD = (req, res, next) => {
  if (!req.user.isHOD) {
    return res.status(401).json({
      error: 'unauthorized',
    });
  }
  next();
};
