import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import userRoute from "./routers/user.router.js"
import authRoute from "./routers/auth.router.js"
import  postRoute from './routers/post.router.js'
import commentRoute from './routers/comment.router.js'
import cookieParser from "cookie-parser"

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
app.use(cookieParser());

app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);
app.use('/api/post',postRoute);
app.use('/api/comment',commentRoute);

app.use((err,req,res,next)=>{
    const statusCode= err.statusCode || 500;
    const message= err.message || "Internel server error";
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
});