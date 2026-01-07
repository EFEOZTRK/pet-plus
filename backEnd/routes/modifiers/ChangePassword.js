import express from "express"
import UserSchema from "../../models/User.js"
import bcrypt from "bcrypt"
import {AuthVerifier} from "../AuthVerify.js"

const router = express.Router();

router.patch("/change-password", AuthVerifier, async(req,res)=>{
    try{
    const currentPassword = req.body.current?.trim();
    const newPassword = req.body.newPass?.trim();
    const id = req.user.id;

    if(newPassword.length < 8){
        return res.status(400).json({succes:false, msg: "Password must be at least 8 characters" })
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({succes: false , msg: "New password must be different from current password"})
    }

    if(currentPassword && newPassword){
       const user = await UserSchema.findById(id);
       if(!user){ return res.status(401).json({success: false , msg: "Could not update password!"})}

       const comparePassword = await bcrypt.compare(currentPassword, user.password);

       if(comparePassword){
        const hashNewPassword = await bcrypt.hash(newPassword,10);
        await UserSchema.findByIdAndUpdate(id, {$set: {password: hashNewPassword}})
        return res.status(200).json({success: true, msg: "Password Updated!"})

       }else{
        return res.json({success: false, msg: "Current password must match!"})
       }
       
    }
    else{
        return res.json({success: false, msg: "Please fill every field!"})
    }

    }
    catch(err){
        return res.json({success: false, msg: "Server Error!"})
    }


    
})


export default router
