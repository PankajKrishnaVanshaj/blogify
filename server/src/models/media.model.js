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
    
  },
  {
    timestamps: true,
  }
);


export const Medias = mongoose.model("Media", mediaSchema);
