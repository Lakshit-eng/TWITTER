
import mongoose from "mongoose"
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
})
const databaseConnection = () => {
    mongoose.connect("mongodb://localhost:27017/twitter").then(() => {
        console.log("connected to mongodb");

    }).catch((error) => {
        console.log(error);
    })
}
export default databaseConnection;

//||"mongodb://localhost:27017/twitter"