import express from "express"
import UserSchema from "../../models/User.js"
import { AuthVerifier } from "../../routes/AuthVerify.js"

const router = express.Router()

router.patch("/edit-profile",AuthVerifier, async (req,res)=>{
    
    try{
        const updatedInfo = req.body
        const userId = req.user.id;
        
        const updatedUser = await UserSchema.findByIdAndUpdate(userId, {$set: updatedInfo}, {new: true});
        return res.json({success : true, msg: "Updated succesfully!" ,updatedUser: updatedUser});
    


    }
    catch(err){
        console.log(err);
        return res.status(500).json({success: false, msg: "Failed to update profile"})
    }
    
    
    
})


export default router