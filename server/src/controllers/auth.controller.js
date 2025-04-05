import jwt from "jsonwebtoken";
import {
  compareString,
  createAccessToken,
  createRefreshToken,
  generateUniqueUsername,
  hashString,
} from "../utils/index.js";
import Users from "../models/user.model.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Provide Required Fields!" });
    }

    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email Address already exists. Try Login" });
    }

    const hashedPassword = await hashString(password);
    const defaultUsername = email.split("@")[0];
    const uniqueUsername = await generateUniqueUsername(defaultUsername);

    const user = await Users.create({
      name: `${firstName} ${lastName}`,
      username: uniqueUsername,
      email,
      password: hashedPassword,
      refreshToken: "", // Initialize as string
    });

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    user.refreshToken = refreshToken; // Store as string, not array
    await user.save();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    user.password = undefined;
    res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please Provide User Credentials" });
    }

    const user = await Users.findOne({ email }).select("+password");
    if (!user || !(await compareString(password, user.password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    user.refreshToken = refreshToken; // Store as string
    await user.save();

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const user = await Users.findOne({ refreshToken });
      if (user) {
        user.refreshToken = ""; // Clear refresh token
        await user.save();
      }
    }

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided. Please log in." });
    }

    const user = await Users.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(403).json({ success: false, message: "Invalid refresh token." });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      if (decoded.userId !== user._id.toString()) { // Match payload key
        throw new Error("Token mismatch");
      }

      const newAccessToken = createAccessToken(user._id);

      res.cookie("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
      });
    } catch (error) {
      user.refreshToken = ""; // Clear invalid token
      await user.save();
      res.clearCookie("accessToken", cookieOptions);
      res.clearCookie("refreshToken", cookieOptions);
      return res.status(403).json({
        success: false,
        message: "Refresh token expired or invalid.",
      });
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const me = async (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized: No access token provided" });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await Users.findById(decoded.userId)
      .select("-password")
      .populate({
        path: "blockedUsers.user following.user followers.user",
        select: "_id name username avatar",
      })
      .populate({
        path: "bookMarks.postId",
        select: "_id title",
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(`Error in 'me' route: ${error.message}`);
    res.status(401).json({ error: "Invalid or expired access token" });
  }
};

// `update` remains unchanged as it’s not directly related to the refresh issue

export const update = async (req, res) => {
  const { name, username, bio, avatar } = req.body;

  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No access token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired access token" });
    }

    const user = await Users.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username && username !== user.username) {
      const usernameExists = await Users.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          error: "Username already taken. Please choose another one.",
        });
      }
    }

    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    const updatedUser = await Users.findById(decoded.userId).select("-password");

    res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    // console.error(`Error in update route: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};