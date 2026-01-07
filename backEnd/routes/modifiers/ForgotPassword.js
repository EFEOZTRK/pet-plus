import express from "express"
import crypto from "crypto"
import UserSchema from "../../models/User.js"
import { Resend } from "resend"

// IN RESET-PASSWORD ROUTE RECEIVE THE TOKEN THAT USER HAS FROM THE LINK IN THEIR MAIL 
// ROUTE THE USER TO THE LOGIN PAGE ALONG WITH A TRUE STATE AND THE TOKEN ATTACHED TO THE LINK


const router = express.Router()

router.post("/forgot-password", async (req,res)=>{
    try{
    const email = req.body.email
    const trimmedEmail = email.trim()
    if(!trimmedEmail){return res.status(400).json({success: false, msg: "Email field can not be empty!"})}
    

    const user = await UserSchema.findOne({email: trimmedEmail});
    if(!user.email){return res.status(400).json({success: false, msg: "Email does not exist!"})} 

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    user.resetPasswordToken = hashedToken;
    await user.save()

    const resend = new Resend(process.env.resend);
    
    await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Petplus password reset! ",
            html: `<a href="http://localhost:3000/reset-password?token=${hashedToken}"> PetPlus password reset link </a>`
    })

    return res.status(200).json({success: true, msg: "Password reset link sent to email."})


    }
    catch(err){
       return res.status(500).json({success: false, msg: "Server error"})
    }

})

export default router