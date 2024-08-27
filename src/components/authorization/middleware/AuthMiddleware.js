import jwt from 'jsonwebtoken';

let JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export default authMiddleware;
