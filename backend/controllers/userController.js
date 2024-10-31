import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//user register controller

export const Register = async (req, res) => {

    try {
        const { name, username, email, password } = req.body;

        //basic validation
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "User already Exists",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            name,
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: "Account created successfully",
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

//user login controller

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "All fields are required",
                success: false
            })
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect Email or Password",
                success: false
            })
        }

        //now if the email exist then we will compare the password

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or Password",
                success: false
            })
        }

        //if the password is matched we will generate a token for user 

        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" })
        return res.status(201).cookie("token", token, { expiresIn: "id", httpOnly: true }).json({
            message: `welcome back ${user.name}`,
            user,
            success: true
        });
    } catch (err) {
        console.log(err);
    }
}

//bookmarks

export const bookmarks = async (req, res) => {
    try {
        const loggedUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedUserId);

        //if already saved
        if (user.bookmarks.includes(tweetId)) {
            //remove
            await User.findByIdAndUpdate(loggedUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "removed from bookmark"
            })
        }
        else {
            //bookmark
            await User.findByIdAndUpdate(loggedUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "added to bookmark"
            })
        }

    } catch (error) {
        console.log(error);
    }
}

//Logout

export const Logout = (req, res) => {
    return res.cookie("token", "", { expiresIn: new Date(Date.now()) }).json({
        message: "User Logged Out Successfully",
        success: true
    })
}

//get my profile

export const getMyProfile = async (req, res) => {

    try {
        const id = req.params.id;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            user,
        })

    } catch (error) {
        console.log(error);
    }
}

//get other users

export const getOtherUsers =async( req,res)=>{
    try{
        const id= req.params.id;
        const otherUsers = await User.find({_id:{$ne:id}}).select("-password");
        if(!otherUsers){
            return res.status(401).json({
                message:"currently do not have any user"
            })
        }else{
            return res.status(200).json({
             otherUsers
        })

    }
}catch(error){
    console.log(error);
}
}

//follow and unfollow

export const follow = async(req,res)=>{
    try{
      const loggedinUserId = req.body.id;   //loggedin user id
      const userId = req.params.id;      // the id of user who is getting followed
      const loggedinUser = await User.findById(loggedinUserId);
      const user = await User.findById(userId);
      if(!user.followers.includes(loggedinUserId)){
        await user.updateOne({$push:{followers:loggedinUserId}});
        await loggedinUser.updateOne({$push:{following:userId}});
      }else{
        //unfollow
        return res.status(400).json({
            message:"user already follow to abhay"
        })
      }
       res.status(200).json({
        message:`${loggedinUser.name} just followed ${user.name}`
       })

    }catch(error){
      console.log(error);
    }
}

//unfollow

export const unfollow =async(req,res)=>{
    try{
        const loggedUserId = req.body.id;
        const userId = req.params.id;
        const loggedinUser = await User.findById(loggedUserId);
        const user = await User.findById(userId);

        if(!loggedinUser.following.includes(userId)){
            return res.status(401).json({
                message:"You Dont follow this user"
            })
        }else{
            await user.updateOne({$pull:{followers:loggedUserId}});
            await loggedinUser.updateOne({$pull:{following:userId}});
        
        }
        return res.status(200).json({
            message:`${loggedinUser.name} just unfollowed ${user.name}`
        })
    }catch(error){
        console.log(error);
    }
}

