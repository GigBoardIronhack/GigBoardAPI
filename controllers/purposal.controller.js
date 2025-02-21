const Purposal = require("../models/Purposal.model");
const Artist = require("../models/Artist.model");
const User = require("../models/User.model");

module.exports.purposalCreate = async (req, res, next) => {
  try {
    const { id } = req.params
    const promoterId =req.currentUserId
    const existingPurposal = await Purposal.findOne({
      promoter: promoterId,
      artist: id,
    });
    if(existingPurposal) {
      return res.status(400).json({message: "Ya ha hecho una propuesta para este artista, puede editarla si lo desea"})
    }
    
    const purposal = await Purposal.create({
      promoter: promoterId,
      artist: id,
      eventDate: req.body.eventDate,
      status: req.body.status,
      notes: req.body.notes
    },);
    const populatedPurposal = await Purposal.findById(purposal.id).populate("artist");
    res.status(201).json(populatedPurposal);
  } catch (error) {
    next(error);
  }
};

module.exports.editPurposal = async (req, res, next) => {
  try {
    console.log("Datos recibidos en el backend:", req.body);
    const purposal = await Purposal.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        eventDate: req.body.eventDate,
        negotiatedPrice: req.body.negotiatedPrice
        
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
  
module.exports.listAgencyPurposal = async (req, res, next) => {
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

module.exports.listPromoterPurposal = async (req, res, next) =>{
  try{
    const promoterId = req.currentUserId
    const purposals = await Purposal.find({ promoter: promoterId } ).populate("artist");
    res.status(200).json(purposals);

  }catch(error){
    next(error)
  }
}



module.exports.getPurposal = async (req, res, next)=>{
  try{
     const purposalId = req.params.id;  
    const purposal = await Purposal.findById(purposalId).populate("promoter artist");
          res.status(200).json(purposal);
  }catch(error){
    next(error)
  }
}

module.exports.purposalDelete= async (req, res, next) =>{
    try{
        await Purposal.findByIdAndDelete(req.params.id)
        res.status(200).json()
    }catch(error){
        next(error)
    }
}
