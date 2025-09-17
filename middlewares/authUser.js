import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const authUser = async (req, res, next) => {
  const token = req.headers.token;

  if (!token)
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log(decoded);
    const user = await userModel.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    req.user = user; // attach user to request
    next();

  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: 'Token is invalid or expired' });
  }
};

export default authUser;
