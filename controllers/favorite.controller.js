const Favorite = require("../models/Favorite.model")
const User = require("../models/User.model")

module.exports.favorite = async (req, res, next) => {
  try {
    const userId = req.currentUserId;
    const artistId = req.params.artistId;

    // Intentamos eliminar el favorito si existe
    const existingFavorite = await Favorite.findOneAndDelete({ promoter: userId, artist: artistId });

    if (existingFavorite) {
      return res.status(200).json({ message: "Like removed" });
    }

    // Si no existía, lo creamos
    await Favorite.create({ promoter: userId, artist: artistId });
    res.status(201).json({ message: "Like added" });
  } catch (error) {
    next(error);
  }
};

module.exports.listFavorites = async (req, res, next) => {
  try {
    const userId = req.currentUserId;

    const favorites = await Favorite.find({ promoter: userId }).populate("artist")

    if (favorites) {
      res.status(200).json(favorites)
    }
  } catch (error) {
    next(error)
  }
}
