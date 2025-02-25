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
const SPOTIFY_URL_REGEX = /^https:\/\/open\.spotify\.com\/(artist|album|track|playlist|episode|show)\/[a-zA-Z0-9]{22}(\?.*)?$/;


const ArtistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true
    },
    imageUrl: {
      type: String,
      required: true,
    },
    rrss: {
      type: {
        instagram: { type: String },
        tiktok: { type: String },
        facebook: { type: String },
        twitter: { type: String }
      },
      default:{}

    },
    description: {
      type: String,
      required: true,
    },
    spotiUrl: {
      type: String,
      trim:true,
    },
    youtubeUrl: {
      type: String,
    },
    style: {
      type: [String],
      required: true,
      enum: GENRES_LIST,
    },
    basePrice: {
      type: Number,
      required: [true, "Base price is required"],
    },
    pricingModifiers: {
      type: {
        club: { type: Number, default: 0 },
        festival: { type: Number, default: 0 },
        specialEvent: { type: Number, default: 0 },
        capacity: {
          small: { type: Number, default: 0 },
          large: { type: Number, default: 0 },
        },
        weekendBoost: { type: Number, default: 0 },
        monthBoost: { type: Number, default: 0 }
      },
      default: {},
    },
    timestamp: { 
      type: Date,
      default: Date.now,
    },
    agency: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
