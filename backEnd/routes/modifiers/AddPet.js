import express from "express"
import PetSchema from "../../models/Pet.js"
import UserSchema from "../../models/User.js"
import {AuthVerifier} from "../AuthVerify.js"

const router = express.Router()


router.post("/add-pet",AuthVerifier, async(req,res)=>{

    const userId = req.user.id
    const user =  await UserSchema.findById(userId)
    
    if(user.pets.length == 1 && !user.isPremium) return res.json({success: false, msg: "Only premium users can have more than 1 pet!"})

    try{

        const pet = await PetSchema.create({
            userId,
            ...req.body,
        })
        
        
        await UserSchema.findByIdAndUpdate(userId, {
            $push: {pets: pet._id}
        })
        
        return res.json({success: true , msg: "Pet Added" , pet})

    }
    catch(err){
        return res.status(500).json({success: false , msg: "Failed to add pet"})
    }
    

} )


export default router
