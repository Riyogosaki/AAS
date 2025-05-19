import MessageModel from "../models/message.model.js";
import UserModel from "../models/user.model.js";        

export  const createMessage = async (req,res)=>{
const {message} = req.body;
const sender = req.user._id;
const receiver = req.params._id;

try {

const user = await UserModel.findById(receiver);
if(!user){
    return res.status(404).json({error:"User not found"});
}
    const newMessage =  new MessageModel({
        message,sender,receiver
    });
    
    const savedMessage = await newMessage.save();
    return res.status(201).json({success:true,data:savedMessage});
} catch (error) {
    console.error("error in creating Message",error.message);
    return res.status(500).json({error:"Internal Server error"});
}
};
export const getMessage = async (req, res) => {
  const sender = req.user._id;           
  const receiver = req.params.id;        

  try {
    const messages = await MessageModel.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ createdAt: 1 });           

    return res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error("error in getting message", error.message);
    return res.status(500).json({ error: "Internal Server error" });
  }
};
