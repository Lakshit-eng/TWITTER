import express from "express";
import{createTweet, deleteTweet, followingTweets, getAllTweets, likeOrDislike} from "../controllers/tweetController.js"
import  isAuthenticated  from "../config/auth.js";
const router = express.Router();

router.post("/create",isAuthenticated,createTweet);

//delete route
router.delete("/delete/:id",isAuthenticated,deleteTweet);

//upfdate route
router.put("/like/:id",isAuthenticated,likeOrDislike);

//get all tweets
router.get("/alltweets/:id",isAuthenticated,getAllTweets);

//following tweets
router.get("/followingtweets/:id",isAuthenticated,followingTweets);

export default router;