import express from"express";
import dotenv from "dotenv";
import databaseConnection from "./config/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js"
import tweetRoute from "./routes/tweetRoute.js"
import cors from 'cors';
const app = express();

dotenv.config({
    path:".env"
})

//DataBase connection
databaseConnection();

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000", // Frontend origin
    credentials: true,               // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE"], // Add allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Add necessary headers
  };
  
  app.use(cors(corsOptions));
  
//api

app.use("/api/v1/user",userRoute);
app.use("/api/v1/tweet",tweetRoute);


//port
app.listen(process.env.PORT,()=>{
    console.log("server is listing to :",process.env.PORT);
    
}); 