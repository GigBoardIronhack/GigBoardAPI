const Artist = require("../models/Artist.model");
const User = require("../models/User.model");

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
      agency: req.currentUserId,
    };

    console.log("Datos Transformados para Guardar:", artistData);
    const newArtist = await Artist.create(artistData);
    res.status(201).json(newArtist);
    const updateUser = await User.findById(req.currentUserId);
    updateUser.artists.push(newArtist.id);
    await updateUser.save();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.artistDetail = async (req, res, next) => {
  try {
    const artist = await Artist.findById(req.params.id).populate("agency");
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
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.status(200).json(artist);
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

