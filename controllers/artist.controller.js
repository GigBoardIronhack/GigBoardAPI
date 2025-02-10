const Artist = require("../models/Artist.model");

module.exports.artistDetail = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id);
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.artistEdit = async (req, res, next) => {
  try {
    const artist = await Artist.findByIdAndUpdate(
        req.params.id, 
        req.body,      
        { new: true, runValidators: true } 
      );
      if (!artist) {
        return res.status(404).json({ message: "Artist not found" });
      }
  
      res.status(200).json(artist);
  } catch (error) {
    next(error);
  }
};

module.exports.artistDelete = async (req, res, next) => {
    try{
         await Artist.findByIdAndDelete(req.params.id)
         if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
          }
        res.status(204).json()
    }
  
    catch(error){
        next(error)
    }
};
