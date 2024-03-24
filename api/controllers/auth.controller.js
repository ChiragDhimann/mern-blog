import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorhandler } from "../utils/error.js";

export const signup=async (req,res,next)=>{
    let {username,email,password}=req.body;
     
    if(!username || !email || !password || username==="" || email==="" || password===""){
        next(errorhandler(400,"All fields required"));
    }

    const hashPassword=bcryptjs.hashSync(password,10);

    let newUser=new User({
        username,email,password :hashPassword
    });

    

    try{
    await newUser.save();
    res.json("Data saved");
    }
    catch(err){
        next(err);
    }
}