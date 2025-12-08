import express from 'express';  

import{createMessage, getMessage} from "../controllers/message.controller.js";
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();
router.post("/:_id",protectRoute,createMessage);
router.get("/:id",protectRoute,getMessage);

export default router;
