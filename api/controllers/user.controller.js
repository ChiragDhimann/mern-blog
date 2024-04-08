import { errorhandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';

export const test=(req,res)=>{
    res.json({message:"api is working"});
}

export const updateUser=async (req,res,next)=>{
    if(req.user.id !== req.params.userId){
        return next(errorhandler(403,"you are not allowed update to this user"));
    }

    if(req.body.password){
        if(req.body.password.length<6){
            return next(errorhandler(400,"password must be at least 6 characters"));
        }
        req.body.password=bcryptjs.hashSync(req.body.password,10);
    }

    if(req.body.username){
        if(req.body.username.length<7 || req.body.username.length >20){
            return next(errorhandler(400,"Username must be between 7 and 20 characters"))
        }

        if(req.body.username.includes(' ')){
            return next(errorhandler(400,"Username can't contain spaces"))
        }

        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorhandler(400,"Username must be lowercase"));
        }

        if(req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorhandler(400,"Username can only contain lettes and numbers"));
        }
    }
        try{
            const updatedUser=await User.findByIdAndUpdate(req.params.userId,{
                $set:{
                    username:req.body.username,
                    password:req.body.password,
                    email:req.body.email,
                    profilePicture:req.body.profilePicture,
                },
            },{new:true});
            const {password,...rest}=updatedUser._doc;
            res.status(200).json(rest);
        }catch(error){
            next(error);
        }
}

export const deleteUser=async (req,res,next) =>{
    if(req.user.id !== req.params.userId){
        return  next(errorhandler(403,'You are not allowed to delete this account'));
    }

    try{
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json("User has been deleted");
    }catch(err){
        next(err);
    }
}

export const signOut=(req,res,next)=>{
    try{
        res.clearCookie('access_token').status(200).json("User has been sign out");
    }catch(err){
        next(err);
    }
}