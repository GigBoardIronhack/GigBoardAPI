const mongoose = require("mongoose");
const { Schema } = mongoose;

const PurposalSchema = new Schema(
  {
    promoter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artist: {
      type: Schema.Types.ObjectId,
      ref: "Artist",
      required: true,
    },
    negotiatedPrice: {
      type: Number,
      required: [true, "Negotiated price is required"],
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    virtuals: true,
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Purposal = mongoose.model("Purposal", PurposalSchema);
module.exports = Purposal;
