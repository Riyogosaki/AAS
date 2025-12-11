import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import homeRoutes from "./routes/home.routes.js";
import messageRoutes from "./routes/message.route.js";
import { ConnectDb } from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({
  origin: "*", // Vite
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/message", messageRoutes);




app.listen(PORT, () => {
  ConnectDb();
  console.log(`Server running on port ${PORT}`);
});
