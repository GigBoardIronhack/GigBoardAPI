const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
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
      enum: ["agency", "promotor"],
    },
    artists: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Artist",
        },
      ],
      required: true,
    },
    imageUrl: {
      type: String,
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
        delete ret.password;
        return ret;
      },
    },
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
