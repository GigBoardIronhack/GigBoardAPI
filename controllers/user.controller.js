const User = require("../models/User.model");

module.exports.userDetail = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("artist");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.userEdit = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.currentUserId, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports.userDelete = async (req, res, next) => {
    try{
         await User.findByIdAndDelete(req.currentUserId)
        res.status(204).json()
    }
  
    catch(error){
        next(error)
    }
};
