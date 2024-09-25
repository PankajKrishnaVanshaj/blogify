import {
  compareString,
  createJWT,
  generateUniqueUsername,
  hashString,
} from "../utils/index.js";
import Users from "../models/user.model.js";
import path from "path";
import { deleteFile } from "../utils/Files.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Provide Required Fields!" });
    }

    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res
        .status(400)
        .json({ message: "Email Address already exists. Try Login" });
    }

    const hashedPassword = await hashString(password);

    const defaultUsername = email.split("@")[0];
    const uniqueUsername = await generateUniqueUsername(defaultUsername);

    const user = await Users.create({
      name: firstName + " " + lastName,
      username: uniqueUsername,
      email,
      password: hashedPassword,
    });

    // Exclude password from the response
    user.password = undefined;

    const token = createJWT(user._id);

    // Set token in a cookie
    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Provide User Credentials" });
    }

    // Find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await compareString(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Exclude password from the response
    user.password = undefined;

    const token = createJWT(user._id);

    // Set token in a cookie
    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// logged-in user
export const me = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    const userId = req.user._id; // Get the user's ID from the request

    // Retrieve user data without the password field
    const user = await Users.findById(userId).select("-password");

    // Check if user data was found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data
    return res.status(200).json(user);
  } catch (error) {
    // More detailed logging for errors
    console.error(`Error in 'me' route: ${error.message}`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const update = async (req, res) => {
  const { name, username, bio } = req.body; // Exclude avatar from req.body
  let avatarFilename; // Declare this outside to handle avatar logic

  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not authenticated" });
    }

    const userId = req.user._id; // Get the user's ID from the request

    // Find the user by ID
    const user = await Users.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the username is provided and it's different from the current one
    if (username && username !== user.username) {
      // Check if the new username already exists in the database
      const usernameExists = await Users.findOne({ username });

      if (usernameExists) {
        return res.status(400).json({
          error: "Username already taken. Please choose another one.",
        });
      }
    }

    // Update user fields only if new values are provided
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;

    // Handle avatar upload
    if (req.file) {
      const avatarPath = req.file.path;
      avatarFilename = path.basename(avatarPath);

      // Handle old avatar file deletion
      if (user?.avatar) {
        deleteFile(user.avatar, "uploads/avatar");
      }

      user.avatar = avatarFilename; // Assign new avatar filename to user
    }

    // Save the updated user data
    await user.save();

    // Return the updated user data (excluding password)
    const updatedUser = await Users.findById(userId).select("-password");

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error in update route: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
