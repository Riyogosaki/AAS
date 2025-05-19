import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    fullName: {
        type: String,
        required: true,
    },
    password: {
        required: true,
        type: String,
        minLegth: 6,
        maxLenght: 20,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

 followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },

    link: {
        type: String,
        default: "",
    },
    likedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: [],
        },
    ],
},


{ timestamps: true }
);

const UserModel = await mongoose.model("User", UserSchema);

export default UserModel