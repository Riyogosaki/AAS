import UserModel from "../models/user.model.js";

export const GetMe = async (req, res) => {
  const { username } = req.params;  

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  try {
    const datauser = await UserModel.findOne({ username }).select("-password");

    if (!datauser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ success: true, datauser });
    
  } catch (error) {
    console.error("Error in GetMe", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const GetUser = async(req,res)=>{
try {
  const response = await UserModel.find({}).select("username profileImg fullName");
  res.status(200).json({success:true,response});
} catch (error) {
  console.error("error in getuser",error.message);
  return res.status(500).json({error:"Internal Server Error"});
}
}
