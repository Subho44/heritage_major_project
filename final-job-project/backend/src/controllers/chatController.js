import Chat from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  try {
    const chat = await Chat.create({
      sender: req.user._id,
      receiver: req.body.receiver,
      message: req.body.message,
    });
    res.status(201).json({ message: 'Message sent', chat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
