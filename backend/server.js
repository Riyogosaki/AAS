import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import homeRoutes from "./routes/home.routes.js";
import messageRoutes from "./routes/message.route.js";
import { ConnectDb } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
const PORT = process.env.PORT|| 8000;
const __dirname = path.resolve();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes)
app.use("/api/home", homeRoutes);
app.use("/api/message",messageRoutes);


if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
app.listen(PORT, () => {
    ConnectDb();
    console.log("Server is Running on Port 7000");
})