import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    tags: {
      type: [String],
    },
    category: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    views: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Posts = mongoose.model("Posts", postSchema);
