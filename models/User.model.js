const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const CIF_PATTERN = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [EMAIL_PATTERN, "Email is invalid"],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["agency", "promoter"],
    },
    promoterRole:{
      type: String,
      enum:["club", "festival", "specialEvent"]
    },
    promoterCapacity:{
      type: Number,
    },
    artists: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Artist",
        },
      ],
    },
    imageUrl: {
      type: String,
      required: true,
    },
    cif: {
      type: String,
      required: [true, "CIF is required"],
      unique: true,
      match: [CIF_PATTERN, "CIF is invalid"],
      trim: true,
      uppercase: true,
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
        delete ret.password;
        return ret;
      },  
    },
  }
);

UserSchema.pre("save", function (next) {
  if (this.role === "promoter" && Array.isArray(this.artists) && this.artists.length === 0) {
    this.artists = undefined; 
    this.markModified("artists"); 
  }

  if (this.isModified("password")) {
    bcrypt.hash(this.password, 10).then((hash) => {
      this.password = hash;
      next();
    }).catch(err => next(err)); 
  } else {
    next();
  }
});
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
