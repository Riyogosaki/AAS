
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = async (req, res) => {

    try {
        const { fullName, username, email, password } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "username Already Taken" });
        }
        const existingemail = await UserModel.findOne({ email });
        if (existingemail) {
            return res.status(400).json({ success: false, message: "email Already Taken" });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new UserModel({
            fullName,
            email,
            username,
            password: hashedPassword,
			profileImg: req.body.profileImg || "", 
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id,res)
            await newUser.save();

            res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
        } else {
            res.status(400).json({error: "Invalid User data"});

        }

    } catch (error) {
        console.error("cannot SignUp", error.message);
        return res.status(500).json({ success: false, message: "Problem in Signing Up" });
    }
};

export const login = async (req, res) => {
    try {
		const { username, password } = req.body;
		const user = await UserModel.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenAndSetCookie(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			email: user.email,
			followers: user.followers,
			following: user.following,
			profileImg: user.profileImg,
			coverImg: user.coverImg,
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
