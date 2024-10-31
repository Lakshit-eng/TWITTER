import mongoose from "mongoose";
import {Tweet} from "../models/tweetSchema.js"
import { User } from "../models/userSchema.js";

//create tweet
export const createTweet =async(req,res)=>{
    try{
      const{description,id} = req.body;
      if(!description || !id){
             res.status(401).json({
                message:"Fields can't be empty",
                success:false
             })
      };
      await Tweet.create({
        description,
        userId:id
      });
      return res.status(201).json(
        {
            message:"Tweet Created Succcessfully",
            success:true
        }
      )
           
    }catch(err){
        console.log(err);
    }
}

//delete tweet

export const deleteTweet =async(req,res)=>{
  try{
    const id = req.params.id;
    await Tweet.findByIdAndDelete(id);
    return res.status(201).json({
      message:"tweet deleted successfully",
      success:true
    })
  }catch(err){
    console.log(err.message)
  }
}

//like or dislike

export const likeOrDislike = async (req,res)=>{
try{
  const loggedUserId = req.body.id;
  const tweetId = req.params.id;
  const tweet = await Tweet.findById(tweetId);
  if(tweet.like.includes(loggedUserId)){
       //dislike
       await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedUserId}});
       return res.status(200).json({
        message:"user disliked your tweet",
        
       })
  }else{
    //like
       await Tweet.findByIdAndUpdate(tweetId,{$push:{like:loggedUserId}});
        return res.status(200).json({
          messgae:"user liked your tweet",
        })
      }   

}catch(error){
  console.log(error);
}
}

//get all tweets

export const getAllTweets = async(req,res)=>{
  try{
      //loggedin User all tweets + all the tweets of the users you follow
      const id = req.params.id;
      const loggedinUser = await User.findById(id);
      const loggedinUserTweets = await Tweet.find({userId:id});
      const followingUserTweets =await Promise.all(loggedinUser.following.map((otherUsersId)=>{
      return Tweet.find({userId:otherUsersId})
      }));
      return res.status(200).json({
        tweets:loggedinUserTweets.concat(...followingUserTweets)
      })

  }catch(error){
    console.log(error);
  }
}

//get only following tweets

export const followingTweets = async(req,res)=>{
  try{
    const id = req.params.id;
    const loggedinUser = await User.findById(id);
    const followingUserTweets = await Promise.all(loggedinUser.following.map((followingUserTweets)=>{
      return Tweet.find({userId:followingUserTweets});
    }));
    return res.status(200).json({
      tweets:[].concat(...followingUserTweets)
    })
  }catch(error){
    console.log(error);
  }
}