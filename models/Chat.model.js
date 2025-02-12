const mongoose = require("mongoose");

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    participants: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    virtuals: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

chatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chatId",
  options: { sort: { date: 1 } }, // Sort messages by date in ascending order
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
