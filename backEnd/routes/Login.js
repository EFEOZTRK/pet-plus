import express from "express"
import UserSchema from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import cookie from "cookie-parser"

const router = express.Router()

router.post("/login", async (req,res)=> {
    const isProduction = process.env.NODE_ENV === "production";
    const userObj = req.body;

    if(userObj.email && userObj.password){

     try{

        const user = await UserSchema.findOne({email : userObj.email}).populate("pets");
    
        if(!user) return res.status(400).json({success:false, msg: "Wrong email or password!"})

        // If user found but not verified.
        if(!user.isVerified) return res.status(400).json({success: false , msg: "Please verify your account first!"})
    
        const compare = await bcrypt.compare(userObj.password, user.password);

        if(!compare) return res.status(400).json({success: false , msg: "Wrong email or password!"})

        // Everthing going good here so signing the jwt
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure : isProduction, // Will be set to true when I host the website (IMPORTANT !!)
            sameSite: isProduction ? "none" : "lax", /* Is lax on production */,
            maxAge: 60 * 60 * 1000
        })
        console.log("User logged in");
        // Here I am making the user json into an object so I can delete the password field before sending it to front-end
        const finalUser = user.toObject()
        delete finalUser.password;
        return res.status(200).json({success:true , user: finalUser})
        
        
     }
     catch(err){
        console.error(err)
      return  res.status(500).json({success:false , msg: "Server error"})
     }

     
     
     

    }else{
       return res.status(400).json({success:false , msg: "Please fill both fields!"})
    }

})


export default router