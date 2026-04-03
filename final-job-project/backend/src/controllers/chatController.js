import Message from '../models/Message.js';

export const getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    if (!receiverId) {
      return res.status(400).json({
        message: 'Receiver ID is required',
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error('Get messages error:', err.message);
    return res.status(500).json({
      message: 'Failed to fetch messages',
    });
  }
};

export const saveMessages = async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text || !text.trim()) {
      return res.status(400).json({
        message: 'Receiver and text are required',
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver,
      text: text.trim(),
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error('Save message error:', err.message);
    return res.status(500).json({
      message: 'Failed to save message',
    });
  }
};