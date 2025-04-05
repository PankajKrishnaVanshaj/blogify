import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/user.model.js";

export const hashString = async (userValue) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(userValue, salt);
};

export const compareString = async (userPassword, password) => {
  return await bcrypt.compare(userPassword, password);
};

export function createAccessToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
  });
}

export function createRefreshToken(id) {
  return jwt.sign({ userId: id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export const generateUniqueUsername = async (baseUsername) => {
  let username = baseUsername;
  let exists = await Users.findOne({ username });

  while (exists) {
    const randomNumber = Math.floor(Math.random() * 90000) + 10000;
    username = `${baseUsername}${randomNumber}`;
    exists = await Users.findOne({ username });
  }

  return username;
};