const Artist = require("../models/Artist.model");
const User = require("../models/User.model");

module.exports.artistCreate = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;
  try {
    const artistData = {
      ...req.body,
      agency: req.currentUserId,
    };
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
    const artists = await Artist.find();
    res.status(200).json({ artists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

/* module.exports.artistCreate = async (req, res, next) => {
  if (req.file) req.body.imageUrl = req.file.path;

  const artist = new Artist({
    name: req.body.name,
    imageUrl: req.body.imageUrl,
    description:req.body.description,
    style:req.body.style,
    basePrice:req.body.basePrice,
    agency:req.body.agency,
  })
  try {
    const newArtist = await artist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
} */
