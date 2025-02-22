const Message = require("../models/Message.model");

// Get all messages from chat
module.exports.createMessage = async (req, res) => {
  const sender = req.currentUserId;
  const { text, chatId } = req.body;

  const message = new Message({
    chatId,
    text,
    sender, 
  });

  try {
    const newMessage = await message.save();
    newMessage = await newMessage.populate('sender');
    console.log("entro aqui=?", newMessage);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
