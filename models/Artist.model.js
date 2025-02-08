const mongoose = require("mongoose");
const { Schema } = mongoose;

const GENRES_LIST = [
  "rock", "hard rock", "alternative rock", "grunge", "metal", "heavy metal",
  "pop", "synth-pop", "indie pop",
  "jazz", "swing", "fusion", "bebop",
  "electronic", "house", "techno", "trance", "drum and bass",
  "hip-hop", "rap", "trap",
  "reggae", "ska", "dub",
  "blues", "soul", "r&b",
  "classical", "baroque", "romantic",
  "folk", "country", "bluegrass",
  "funk", "disco",
  "latin", "salsa", "bachata", "flamenco",
  "experimental", "ambient", "lo-fi"
];

const ArtistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    style: {
      type: [String],
      required: true,
      enum: GENRES_LIST,
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

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;
