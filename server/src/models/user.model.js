import mongoose, { Schema } from "mongoose";

// Define the Notification Schema
const notificationSchema = new Schema(
  {
    // type: {
    //   type: String,
    //   required: true,
    // },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    read: {
      type: Boolean,
      default: false,
    },
  }
  // { _id: false } // Prevent auto-generation of _id for notifications
);

// Define the User Schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    isCreator: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false
    },
    refreshToken: [{
      type: String,
      default: null
    }],
    blockedUsers: [
      {
        _id: false,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    following: [
      {
        _id: false,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    followers: [
      {
        _id: false,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    bookMarks: [
      {
        _id: false,
        postId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Posts",
          required: true,
        },
      },
    ],
    notifications: [notificationSchema],
  },
  { timestamps: true }
);

// Create and export the User model
const Users = mongoose.model("Users", userSchema);

export default Users;
