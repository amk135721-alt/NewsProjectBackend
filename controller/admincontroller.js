import admin from "../model/admin.js";
import projectmodel from "../model/projectmodel.js";
import bcrypt from "bcrypt"
import view from "../model/view.js";
import jwt from "jsonwebtoken"
import reportModel from "../model/reportModel.js";



export const createAdmin=async (req,res) => {
    try {
        const {name,email,password}=req.body
        const checkUser=await admin.findOne({email})
        if(checkUser){
            res.json({success:false,message:"User already exist"})
        }
        const encrypass=await bcrypt.hash(password,10)
        const storeUser=await admin.create({name,email,password:encrypass})
        if (!storeUser) {
            res.json({success:false,message:"User not created"})
        }
   
        res.json({success:true,message:"User Created successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
    
}


export const    adminLogin =async (req,res) => {
   try {
     const {email,password}=req.body
    const checkEmail=await admin.findOne({email})
     if (!checkEmail) {
            res.json({success:false,message:"Admin not registered"})
        }
        const comparepassword=await bcrypt.compare(password,checkEmail.password) //encrypting password
        if(!comparepassword){
res.json({success:false,message:"Invalid Credentials"})
        }           
        //token generated
        res.json({success:true,message:"Login successful"})
   } catch (error) {
    res.json({success:false,message:error.message})
   }
}


export const viewReport=async (req,res) => {
    try {
        const find=await reportModel.find().populate("userId").populate("newsId")
        if (!find) {
        res.json({success:false,message:"no data found"})
        }
        res.json({success:true,message:"-----Report----",data:find})
    } catch (error) {
        res.json({success:false,message:error.message})
    }  
}


