import {
  compareString,
  createJWT,
  generateUniqueUsername,
  hashString,
} from "../utils/index.js";
import Users from "../models/user.model.js";

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
    // Assuming req.user contains user data
    const userData = req.user;

    // Create a copy of the user data without sensitive fields
    const { password, email, ...userPublicData } = userData.toObject(); // Convert mongoose document to plain object

    // Log the user data for debugging (optional)
    // console.log(userPublicData);

    // Return the user data without password and email
    return res.status(200).json({ msg: userPublicData });
  } catch (error) {
    console.log(`Error from user route: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
