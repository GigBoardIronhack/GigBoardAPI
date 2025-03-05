const Artist = require("../models/Artist.model");
const User = require("../models/User.model");
const Favorite = require("../models/Favorite.model");
const Purposal = require("../models/Purposal.model");

module.exports.artistCreate = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;
  console.log(req.body)
  try {
    console.log("Datos Recibidos:", req.body);

    const artistData = {
      ...req.body,
      basePrice: Number(req.body.basePrice),
      pricingModifiers: {
        club: Number(req.body.club),
        festival: Number(req.body.festival),
        specialEvent: Number(req.body.specialEvent),
        capacity: {
          small: Number(req.body.small),
          large: Number(req.body.large)
        },
        weekendBoost: Number(req.body.weekendBoost),
        monthBoost: Number(req.body.monthBoost)
      },
      rrss: {
        instagram: req.body.instagram,
        tiktok: req.body.tiktok,
        facebook: req.body.facebook,
        twitter : req.body.twitter
      },
      agency: req.currentUserId,
    };

    console.log("Datos Transformados para Guardar:", artistData);
    const newArtist = await Artist.create(artistData);
    res.status(201).json(newArtist);
    const updateUser = await User.findById(req.currentUserId);
    updateUser.artists.push(newArtist.id);
    await updateUser.save();
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = {};
      
      Object.keys(error.errors).forEach((field) => {
        errors[field] = error.errors[field].message; 
      });
    res.status(400).json({ errors });
  }
}
};

module.exports.artistDetail = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).populate("agency purposals");
    res.status(200).json(artist);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports.artistList = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.name) filters.name = { $regex: req.query.name, $options: "i" };
    
    if (req.query.style) filters.style = { $in: req.query.style.split(",") };


    const artists = await Artist.find(filters);
    res.status(200).json({ artists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.agencyArtistList = async (req, res, next) =>{
  try{
    const agencyId = req.currentUserId;
        const artists = await Artist.find({ agency: agencyId })
        if (!artists.length) {
          return res.status(200).json([]);
        }
        res.status(200).json(artists);
  }catch(error){
    next(error)
  }
}



module.exports.artistEdit = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;
  console.log("editar artista", req.body)
  try {
    console.log()
    const artist = await Artist.findByIdAndUpdate(req.params.id, 
      {
        ...req.body,
      basePrice: Number(req.body.basePrice),
      pricingModifiers: {
        club: Number(req.body.club),
        festival: Number(req.body.festival),
        specialEvent: Number(req.body.specialEvent),
        capacity: {
          small: Number(req.body.small),
          large: Number(req.body.large)
        },
        weekendBoost: Number(req.body.weekendBoost),
        monthBoost: Number(req.body.monthBoost)
      },
      rrss: {
        instagram: req.body.instagram,
        tiktok: req.body.tiktok,
        facebook: req.body.facebook,
        twitter : req.body.twitter
      },
      agency: req.currentUserId,
      }
      , {
      new: true,
      runValidators: true,
    });
    
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
    console.log("Artista actualizado en DB:", artist);
  } catch (error) {
    next(error);
  }
};

module.exports.artistDelete = async (req, res, next) => {
  try {
    const updateUser = await User.findById(req.currentUserId);
    updateUser.artists = updateUser.artists.filter(
      (artist) => artist.toString() !== req.params.id
    );
    await updateUser.save();
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    res.status(204).json(updateUser);
  } catch (error) {
    next(error);
  }
};

module.exports.listRecommendedArtists = async (req, res) => {
  try {
    const promoterId = req.currentUserId

    const favoriteArtists = await Favorite.find({ promoter: promoterId }).populate("artist");
    const favoriteStyles = favoriteArtists.flatMap((fav) => fav.artist.style);
    const purposalArtists = await Purposal.find({ promoter: promoterId }).populate("artist");
    const purposalStyles = purposalArtists.flatMap((purposal) => purposal.artist.style);
    const allStyles = [...favoriteStyles, ...purposalStyles];
    const styleFrequency = allStyles.reduce((acc, style) => {
      acc[style] = (acc[style] || 0) + 1;
      return acc;
    }, {});

    const sortedStyles = Object.entries(styleFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([style]) => style);
    const excludedArtists = [
      ...favoriteArtists.map((fav) => fav.artist._id.toString()),
      ...purposalArtists.map((purposal) => purposal.artist.id.toString()),
    ];

    const recommendedArtists = await Artist.find({
      style: { $in: sortedStyles },
      id: { $nin: excludedArtists },
    })
      .limit(10)
      .lean();
      console.log("🎯 Artistas recomendados desde el backend:", recommendedArtists);
      return res.json(recommendedArtists);
      
  } catch (error) {
    console.error("Error obteniendo artistas recomendados:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};