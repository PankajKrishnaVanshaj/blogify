import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/user.model.js";

dotenv.config();


const authMiddleware = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  
  if (!accessToken) {
    return res.status(401).json({ message: "No access token provided" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      message: error.name === "TokenExpiredError" 
        ? "Access token expired" 
        : "Invalid access token" 
    });
  }
};

export default authMiddleware;