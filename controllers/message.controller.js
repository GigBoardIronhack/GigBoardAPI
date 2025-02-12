const Message = require("../models/Message.model");

// Get all messages from chat
module.exports.create = async (req, res) => {
  const sender = req.currentUserid;
  const { text, chatId } = req.body;

  const message = new Message({
    chatId,
    text,
    sender,
  });

  try {
    const newMessage = await message.save();
    console.log("entro aqui=?", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
