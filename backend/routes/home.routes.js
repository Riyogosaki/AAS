import { deletePost, createPost,getAllPostsData,getUserPost, updatePost} from "../controllers/home.controller.js";
import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();
router.post('/',protectRoute, createPost);
router.get("/",getAllPostsData);
router.delete("/:id",protectRoute,deletePost);
router.get("/user",protectRoute,getUserPost);

export default router;