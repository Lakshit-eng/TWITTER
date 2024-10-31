import express from "express";
import { Register ,Login, Logout, bookmarks, getMyProfile, getOtherUsers, follow, unfollow} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";
const router = express.Router();

router.post("/register",Register);
router.post("/login",Login);
router.get("/logout",Logout);
//bookmarks
router.put("/bookmark/:id", isAuthenticated ,bookmarks);

//get my profile
router.get("/profile/:id",isAuthenticated,getMyProfile);

//get other users
router.get("/otherusers/:id",isAuthenticated,getOtherUsers);

//follow
router.post("/follow/:id",isAuthenticated,follow);

//unfollow
router.post("/unfollow/:id",isAuthenticated,unfollow);

export default router;