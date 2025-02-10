const Purposal = require("../models/Purposal.model");

module.exports.purposalCreate = async (req, res, next) => {
  try {
    const purposal = await Purposal.create(req.body);
    res.status(201).json(purposal);
  } catch (error) {
    next(error);
  }
};


