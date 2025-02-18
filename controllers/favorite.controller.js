const Favorite = require("../models/Favorite.model")
const User = require("../models/User.model")

module.exports.favorite = async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const artistId = req.params.id;

    
    const existingFavorite = await Favorite.findOneAndDelete({ promoter: userId, artist: artistId });

    if (existingFavorite) { 
      return res.status(200).json({ message: "Like removed" });
    }

    await Favorite.create({ promoter: userId, artist: artistId });
    res.status(201).json({ message: "Like added" });
  } catch (error) {
    next(error);
  }
};

module.exports.listFavorites = async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    console.log("Current User ID:", userId);

    const favorites = await Favorite.find({ promoter: userId }).populate("artist promoter")

   
     res.status(200).json(favorites)
    
  } catch (error) {
    next(error)
  }
}
