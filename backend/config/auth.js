import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config({
    path:"../.env"
})


 const isAuthenticated =async(req,res,next)=>{

    try{
    const token = req.cookies.token;
    
    if(!token){
        return res.status(401).json({
            message:"Please Login to create post",
            success:false
        })
    }
  //if token found
  const decode = await jwt.verify(token,process.env.TOKEN_SECRET);
  
  req.user = decode.userId;
  next();

}catch(err){
   console.log(err);
   
}
}

export default isAuthenticated;