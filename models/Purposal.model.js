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

PurposalSchema.pre("save", async function (next) {
  try {
    const purposal = this;

    const promoter = await mongoose.model("User").findById(purposal.promoter);
    const artist = await mongoose.model("Artist").findById(purposal.artist);

    if (!promoter || !artist) {
      throw new Error("Promoter or Artist not found");
    }
    const PRICE = artist.basePrice;
    const { pricingModifiers } = artist; 

    const promoterRolePrice = (pricingModifiers[promoter.promoterRole]) * PRICE;

    let venuePrice = 0;
    if (promoter.promoterCapacity < 1000) {
      venuePrice = pricingModifiers.capacity.small * PRICE;
    } else {
      venuePrice = pricingModifiers.capacity.large * PRICE;
    }
    let dayWeekPrice = 0;
    const dayOfWeek = purposal.eventDate.getDay();
    console.log(dayOfWeek)
    if ((dayOfWeek === 5 || dayOfWeek === 6)) {
      dayWeekPrice = pricingModifiers.weekendBoost * PRICE;
    }
    purposal.negotiatedPrice = Math.round(PRICE + promoterRolePrice + venuePrice + dayWeekPrice);

    next();
  } catch (error) {
    next(error);
  }
});



const Purposal = mongoose.model("Purposal", PurposalSchema);
module.exports = Purposal;
