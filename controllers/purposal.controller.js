const Purposal = require("../models/Purposal.model");

module.exports.purposalCreate = async (req, res, next) => {
  try {
    const purposal = await Purposal.create(req.body);
    res.status(201).json(purposal);
  } catch (error) {
    next(error);
  }
};

module.exports.purposalEdit = async (req, res, next) => {
  try {
    const purposal = await Purposal.findByIdAndUpdate(
      req.params.id,
      req.body.status,
      { new: true, runValidators: true }
    );
    if (!purposal) {
      return res.status(404).json({ message: "Purposal not found" });
    }
    res.status(200).json(purposal);
  } catch (error) {
    next(error);
  }
};
