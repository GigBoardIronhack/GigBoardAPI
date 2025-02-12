const Purposal = require("../models/Purposal.model");
const Artist = require("../models/Artist.model");
const { findByIdAndDelete } = require("../models/User.model");

module.exports.purposalCreate = async (req, res, next) => {
  try {
    const purposal = await Purposal.create(req.body);
    res.status(201).json(purposal);
  } catch (error) {
    next(error);
  }
};

module.exports.agencyEditPurposal = async (req, res, next) => {
  try {
    const purposal = await Purposal.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        eventDate: req.body.eventDate

      },
      { new: true, runValidators: true }
    );
    console.log(purposal)
    if (!purposal) {
      return res.status(404).json({ message: "Purposal not found" });
    }
    res.status(200).json(purposal);
  } catch (error) {
    next(error);
  }
};

module.exports.getPurposalAgency = async (req, res, next) => {
    try{
        const agencyId = req.currentUserId;
        const artists = await Artist.find({ agency: agencyId }).select("id");
        if (!artists.length) {
            return res.status(200).json([]);
          }
          const artistIds = artists.map((artist) => artist.id);
          const purposals = await Purposal.find({ artist: { $in: artistIds } }).populate("promoter artist");
          res.status(200).json(purposals);

    }catch(error){
        next(error)
    }
}

module.exports.purposalDelete= async (req, res, next) =>{
    try{
        const purposal = await findByIdAndDelete(req.params.id)
        res.status(200).json()
    }catch(error){
        next(error)
    }
}
