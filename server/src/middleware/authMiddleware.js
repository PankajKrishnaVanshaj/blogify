import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  const accessToken =
    req.cookies.accessToken ||
    (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "No access token provided. Please log in.",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or account deleted",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Access token expired.",
      });
    }
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};

export default authMiddleware;