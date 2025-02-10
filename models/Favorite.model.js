const mongoose = require("mongoose");
const { Schema } = mongoose;

const FavoriteSchema = new Schema(
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

FavoriteSchema.index({ promoter: 1, artist: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
