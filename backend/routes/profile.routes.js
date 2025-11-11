import express from 'express';
import { GetMe, GetUser} from '../controllers/profile.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
const router =express.Router();

router.get("/userprofile/:username",protectRoute,GetMe);
router.get("/allprofile",GetUser);
export default router;