import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
import { errorhandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin=async (req,res,next)=>{

    const {email,password}=req.body;
    if(!email || !password || email=='' || password==''){
        next(errorhandler(404,"All fields are required"));
    }
    try{
        const validUser=await User.findOne({email});
        if(!validUser){
            return next(errorhandler(404,"User not found"))
        }
        const validPass=bcryptjs.compareSync(password,validUser.password);
        if(!validPass){
            return next(errorhandler(404,"Incorrect Password"));
        }
        const token=jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest}=validUser._doc;
        res.status(200).cookie('access_token',token,{
            httpOnly:true,
        }).json(rest);
    }catch(err)
    {
        next(err);
    }
}

export const google=async (req,res,next)=>{
    const {email,name,photoUrl}=req.body;
    try{
        const user=await User.findOne({email});
        if(user){
            const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.JWT_SECRET);
            const {password,...rest}=user._doc;
            res.status(200).cookie('access_token',token,{
                httpOnly:true,
            }).json(rest)
            }else{
                const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
                const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
                const newuser=new User({
                    username: name.toLowerCase().split(" ").join('')+Math.random().toString(9).slice(-4),
                    email,
                    password:hashedPassword,
                    profilePicture: photoUrl
                });
                await newuser.save();
                const token=jwt.sign({id:newuser._id,isAdmin:newuser.isAdmin},process.env.JWT_SECRET);
                const {password,...rest}=user._doc;
                res.status(200).cookie('access_token',token,{httpOnly: true}).json(rest)
            };
            }
        catch(err){
        next(err);
    }
}