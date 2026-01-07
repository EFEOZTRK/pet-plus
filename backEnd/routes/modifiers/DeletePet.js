import express from "express"
import UserSchema from "../../models/User.js"
import PetSchema from "../../models/Pet.js"
import { AuthVerifier } from "../AuthVerify.js"

const router = express.Router()

router.delete("/delete-pet/:id",AuthVerifier, async(req,res)=>{

    const id = req.params.id;      // Pet ID to delete from
    const user = req.user;         // Logged-in user

  try {
    // Check if pet exists
    const existingPet = await PetSchema.findById(id);
    if (!existingPet) {
      return res.status(404).json({ success: false, msg: "Could not find pet" });
    }

    // Check ownership
    if (existingPet.userId.toString() !== user.id) {
      return res.status(403).json({ success: false, msg: "You are not allowed to delete this pet" });
    }

    // Delete the pet & its id from the user pets:[{id}]
    await PetSchema.findByIdAndDelete(id)
    await UserSchema.findByIdAndUpdate(user.id,{
        $pull: {pets: id}
    })

    return res.json({ success: true });
  
    } // Try block ends
    catch (err) {
    console.error(err);
    return res.status(500).json({success: false,msg: "Could not delete pet. Please try again later.",});
    
    }

})


export default router