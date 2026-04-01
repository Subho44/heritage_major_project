import Message from "../models/Message.js";

export const getMessages = async (req,res) => {
  try {
    const {receiverId} = req.params;
    const message = await Message.find({
      $or:[
       {sender:req.user._id, receiver:receiverId},
       {sender:receiverId,receiver:req.user._id}, 
      ],
    });
    res.json(message);
  } catch(err) {
    console.error(err);
  }
}

//create message
export const saveMessages = async (req,res) => {
  try {
    const {receiver,text} = req.body;
    const message = await Message.create({
      sender:req.user._id,
      receiver,
      text,
    });
    res.json(message);
  } catch(err) {
    console.error(err);
  }
}
