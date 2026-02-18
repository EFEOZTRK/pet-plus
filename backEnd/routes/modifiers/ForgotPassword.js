import express from "express"
import crypto from "crypto"
import bcrypt from "bcrypt"
import UserSchema from "../../models/User.js"
import { Resend } from "resend"


const router = express.Router()

router.post("/forgot-password", async (req,res)=>{
    try{
    const email = req.body.email
    const trimmedEmail = email.trim()
    if(!trimmedEmail){return res.status(400).json({success: false, msg: "Email field can not be empty!"})}
    

    const user = await UserSchema.findOne({email: trimmedEmail});
    if(!user){return res.status(200).json({success: true, msg: "If an account with that email exists, a reset link has been sent."})} 

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save()

    const resend = new Resend(process.env.resend);
    
    await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Petplus password reset! ",
            html: `<a href="http://localhost:3000/reset-password?token=${token}"> PetPlus password reset link </a>`
    })

    return res.status(200).json({success: true, msg: "If an account with that email exists, a reset link has been sent."})


    }
    catch(err){
       return res.status(500).json({success: false, msg: "Server error"})
    }

})


router.get("/reset-password", async (req,res)=>{
    const resetPasswordToken = req.query.token
    if(!resetPasswordToken) return res.status(400).json({success: false, msg: "Invalid or expired password reset link."});

    try{
        const hashUserToken = crypto.createHash("sha256").update(resetPasswordToken).digest("hex")
        const user = await UserSchema.findOne({resetPasswordToken: hashUserToken, resetPasswordExpire: {$gt: Date.now()}})
        
        if(!user){return res.status(400).json({success: false, msg: "Invalid or expired password reset link."})}
        
        return res.redirect(`${process.env.CLIENT_URL}/password-update?token=${resetPasswordToken}`)
    }

    catch(err){
        res.status(500).json({success: false , msg:"Server error"})
    }


    

})

router.post("/update-password", async(req,res)=>{
    try{
        const token = req.query.token;
        const newPassword = req.body.password;
        if(!token) return res.status(400).json({success: false, msg: "Invalid or expired password reset link."})
        if(!newPassword || !newPassword.trim()) return res.status(400).json({success: false, msg: "Please fill both fields."})

        const hashedUserToken = crypto.createHash("sha256").update(token).digest("hex")
        
        const user = await UserSchema.findOne({
         resetPasswordToken: hashedUserToken,
         resetPasswordExpire: {$gt: Date.now()} 
        })
        if(!user) return res.status(400).json({success: false, msg: "Invalid or expired password reset link."})

        const hashNewPassword = await bcrypt.hash(newPassword,10);
        user.password = hashNewPassword
        user.resetPasswordToken = null
        user.resetPasswordExpire = null
        await user.save();
        return res.status(200).json({success: true, msg: "Password Updated"})

    }
    catch(err){
        return res.status(500).json({success: false, msg: "Server error"})
    }


})


export default router