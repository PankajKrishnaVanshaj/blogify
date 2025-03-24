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
    slug: {
      type: String,
      unique: true,
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

// Custom function to generate a slug
const generateSlug = async (title) => {
  let slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  let slugExists = await WebStory.findOne({ slug });
  let counter = 1;

  while (slugExists) {
    const newSlug = `${slug}-${counter}`;
    slugExists = await WebStory.findOne({ slug: newSlug });
    if (!slugExists) {
      slug = newSlug;
      break;
    }
    counter++;
  }

  return slug;
};

// Middleware to generate a unique slug before saving
webStorySchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = await generateSlug(this.title);
  }
  next();
});

export const WebStory = mongoose.model("WebStory", webStorySchema);
