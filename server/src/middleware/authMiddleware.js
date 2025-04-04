import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Users from "../models/user.model.js";

dotenv.config();

// Ensure JWT_SECRET_KEY is available
const JWT_SECRET = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

const authMiddleware = async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const accessToken = req.cookies.accessToken || 
                     (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 
                       ? req.headers.authorization.split(" ")[1] 
                       : null);

  // Check if token exists
  if (!accessToken) {
    return res.status(401).json({ 
      success: false,
      message: "No access token provided. Please log in." 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(accessToken, JWT_SECRET, {
      // Optional: Add additional verification options if needed
      algorithms: ["HS256"], // Ensure only expected algorithm is used
    });

    // Validate decoded payload
    if (!decoded.userId) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token payload" 
      });
    }

    // Find user in database
    const user = await Users.findById(decoded.userId).select("-password"); // Exclude password
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found or account deleted" 
      });
    }

    // Optional: Add additional user checks if needed
    // e.g., if (user.isBanned) { return res.status(403).json({ message: "Account is banned" }); }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false,
        message: "Access token expired. Please log in again.",
        expiredAt: error.expiredAt 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid access token. Token may be malformed or tampered with." 
      });
    } else if (error instanceof jwt.NotBeforeError) {
      return res.status(401).json({ 
        success: false,
        message: "Token not yet valid" 
      });
    }

    // Handle unexpected errors
    console.error("Auth middleware error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Authentication error. Please try again." 
    });
  }
};

export default authMiddleware;