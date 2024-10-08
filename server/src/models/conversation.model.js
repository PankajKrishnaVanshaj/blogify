import mongoose, { Schema } from "mongoose";

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
