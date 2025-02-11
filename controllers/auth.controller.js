const User = require("../models/User.model");
const createError = require("http-errors")
const jwt = require("jsonwebtoken")

module.exports.register = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const loginError = createError(401, "email or password incorrect");

    const user = await User.findOne({ email });
    

    if (!user) {
      return next(loginError);
    }
    const match = await user.checkPassword(password);

    if (!match) {
      return next(loginError);
    }
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1d" }
    );
    res.status(200).json({ accessToken: token });
  } catch (error) {
    next(error);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.currentUserId);
    console.log(user)
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
