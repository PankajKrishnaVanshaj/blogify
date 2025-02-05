import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
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

// Custom function to generate a slug
const generateSlug = async (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  let slugExists = await Posts.findOne({ slug });
  let counter = 1;

  while (slugExists) {
    const newSlug = `${slug}-${counter}`;
    slugExists = await Posts.findOne({ slug: newSlug });
    if (!slugExists) {
      slug = newSlug;
      break;
    }
    counter++;
  }

  return slug;
};

// Middleware to generate a unique slug before saving
postSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = await generateSlug(this.title);
  }
  next();
});

export const Posts = mongoose.model("Posts", postSchema);
