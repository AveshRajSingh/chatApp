import User from "../model/user.model.js";
import Message from "../model/message.model.js";
import mongoose from "mongoose";
import { uploadOnCloudinary } from "../utility/cloudinary.js";

const getUsersForSidebar = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find users who are not the current user
    const users = await User.find({ _id: { $ne: user._id } }).select(
      "-password"
    );
    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error from getUsersForSidebar" });
  }
};

const getMessages = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const senderId = user._id;
    if (!senderId) {
      return res.status(400).json({ message: "Sender ID is required" });
    }
    const { id: receiverId } = req.params;
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (
      mongoose.Types.ObjectId.isValid(senderId) === false ||
      mongoose.Types.ObjectId.isValid(receiverId) === false
    ) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ createdAt: 1 });

    res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal server error from getMessages" });
  }
};


const sendMessage = async (req, res) => {
    
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const senderId = user._id;
    const { id: receiverId } = req.params;
    const { text, image } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver ID and text are required" });
    }

    if (
      mongoose.Types.ObjectId.isValid(senderId) === false ||
      mongoose.Types.ObjectId.isValid(receiverId) === false
    ) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    let imageUrl = null;
    if(image){
       try {
        imageUrl = await uploadOnCloudinary(image);
        if (!imageUrl) {
          return res.status(500).json({ message: "Image upload failed" });
        }
        console.log("Image uploaded successfully:", imageUrl);
       } catch (error) {
        console.error("Error uploading image to Cloudinary:", error.message);
        return res.status(500).json({ message: "Image upload failed" });
        
       }
    }

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      image : imageUrl
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Internal server error from sendMessage" });
  }
}

export { getUsersForSidebar, getMessages ,sendMessage};
