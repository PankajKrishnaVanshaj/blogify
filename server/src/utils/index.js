import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

export const hashString = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedpassword = await bcrypt.hash(userValue, salt);
  return hashedpassword;
};

export const compareString = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt?.compare(userPassword, password);
    return isMatch;
  } catch (error) {
    console.log(error);
  }
};

export function createAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '15m', // Shorter expiration for access token
  });
}

export function createRefreshToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // Longer expiration for refresh token
  });
}

// username generate
export const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let exists = await Users.findOne({ username });

  while (exists) {
    // Generate a random number between 10000 and 99999
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    username = `${baseUsername}${randomNumber}`;
    exists = await Users.findOne({ username });
  }

  return username;
};
