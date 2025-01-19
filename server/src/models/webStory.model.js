import mongoose from "mongoose";

const webStorySchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    storySlides: [
      {
        _id: false,
        content: {
          type: String,
          trim: true,
        },
        media: {
          type: String,
        },
        duration: {
          type: Number,
          default: 5,
        },
      },
    ],
    category: {
      type: String,
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
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
  },
  {
    timestamps: true,
  }
);

export const WebStory = mongoose.model("WebStory", webStorySchema);
