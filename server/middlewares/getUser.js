import jwt from "jsonwebtoken";

const getUser = (req, res) => {
  if (!req.cookies.token) {
    return res.json({
      isLoggedIn: false,
    });
  }

  try {
    const { id, type, name } = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    return res.json({ isLoggedIn: true, id, type, name });
  } catch (error) {
    return res.json({ isLoggedIn: false });
  }
};

export default getUser;
