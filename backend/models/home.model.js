import mongoose from "mongoose";

const mongooseSchema = new mongoose.Schema({
  post: {
    required: true,
    type: String,  // Corrected typo here
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const HomeModel = mongoose.model("Home", mongooseSchema);

export default HomeModel;
