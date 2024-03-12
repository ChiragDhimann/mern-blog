import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"

export const signup=async (req,res)=>{
    let {username,email,password}=req.body;
     
    if(!username || !email || !password || username==="" || email==="" || password===""){
        return res.status(400).json({message:"all fields are require"});
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
        res.status(500).json({message:err.message});
    }
}