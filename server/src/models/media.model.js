import mongoose, { Schema } from "mongoose";

const mediaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v.length <= 10; // Limit tags to 10 for better optimization
        },
        message: "A maximum of 10 tags are allowed.",
      },
    },

    media: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    metadata: {
      type: Object,
      default: function () {
        return {
          "@context": "https://schema.org",
          "@type": "MediaObject",
          uploadDate: new Date().toISOString(),
          creator: "Anonymous",
          keywords: [],
          description: "",
          contentUrl: "",
        };
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update metadata dynamically
mediaSchema.pre("save", function (next) {
  if (this.media) {
    // Update metadata with media data
    this.metadata.contentUrl = this.media; // Schema.org standard for media URL
  }

  if (this.tags && this.metadata) {
    this.metadata.keywords = this.tags; // Include tags as keywords
  }

  if (this.description && this.metadata) {
    this.metadata.description = this.description; // Use description for metadata
  }

  next();
});

// Pre-update hook to handle updates for metadata
mediaSchema.pre("updateOne", function (next) {
  const update = this.getUpdate();
  if (update.media) {
    update.metadata = update.metadata || {};
    update.metadata.contentUrl = update.media;
  }
  if (update.tags) {
    update.metadata = update.metadata || {};
    update.metadata.keywords = update.tags;
  }
  if (update.description) {
    update.metadata = update.metadata || {};
    update.metadata.description = update.description;
  }
  next();
});

// Text index with weights for search optimization
mediaSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 5, description: 2, tags: 1 } }
);

// Unique index for media URL to avoid duplicates
mediaSchema.index({ media: 1 }, { unique: true });

// Optional TTL index to auto-remove old media after a set period (e.g., 30 days)
mediaSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days in seconds

export const Medias = mongoose.model("Media", mediaSchema);
