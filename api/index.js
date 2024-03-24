import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routers/user.router.js"
import authRoute from "./routers/auth.router.js"

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("MongoDb is connect");
})
.catch((err)=>{
    console.log(err);
})

const app=express();

app.listen(3000,()=>{
    console.log("Server listening on port on 3000!");
})

app.use(express.json())

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);

app.use((err,req,res,next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "Internel server error";
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
});