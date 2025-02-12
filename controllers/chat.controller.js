const Chat = require("../models/Chat.model");
const Message = require("../models/Message.model");

// Get all chats
module.exports.list = async (req, res) => {
  const userId = req.currentUserid;

  try {
    const chats = await Chat.find({ participants: userId });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single chat by ID
module.exports.detail = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findById(chatId).populate("messages participants");
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new chat
module.exports.create = async (req, res) => {
  const user1 = req.currentUserid;
  const user2 = req.body.userId;

  const chat = new Chat({
    participants: [user1, user2],
  });

  try {
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete chat by ID
module.exports.chatDelete = async (req, res) => {
  const chatId = req.params.chatId;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    await chat.remove();
    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
