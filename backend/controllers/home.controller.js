import HomeModel from "../models/home.model.js";


export const createPost = async (req, res) => {
  try {
    const { post, title } = req.body;
    const userId = req.user._id;

    const newPost = new HomeModel({ post, title, user: userId });
    const savedPost = await newPost.save();

    res.status(201).json({ success: true, data: savedPost });
  } catch (error) {
    console.error("Error in Saving Post:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const getAllPostsData = async (req, res) => {
  try {
    const data = await HomeModel.find({}).populate("user", "name email"); // optional
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error in Getting Posts:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserPost = async (req, res) => {
  const userId = req.user._id;
  try {
    const data = await HomeModel.find({ user: userId });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Not Able to Get User's Posts:", error.message);
    return res.status(500).json({ error: "User Data is Not Getting" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const post = await HomeModel.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ success: true, message: "Post Deleted Successfully", data: post });
  } catch (error) {
    console.error("Error in Deleting Post:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePost = async (req,res)=>{
  const {id}=req.params;
  const {title,post}=req.body;
  const userId = req.user._id;

  try {
    const posttoupdate = await HomeModel.findById(id);
    if (!posttoupdate) {
      return res.status(404).json({ error: "Post not found" });
    } 
    if (posttoupdate.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You are not authorized to update this post" });
    }
    const updatedPost = await HomeModel.findByIdAndUpdate(id, { title, post }, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ success: true, message: "Post Updated Successfully", data: updatedPost });
    
  } catch (error) {
    console.error("Error in Updating Post:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
    
  }
}