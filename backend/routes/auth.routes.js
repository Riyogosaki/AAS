import express from "express";
import {  login, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",protectRoute,login);
export default router;