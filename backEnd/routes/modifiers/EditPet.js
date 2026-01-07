import express from "express"
import {AuthVerifier} from "../AuthVerify.js"
import UserSchema from "../../models/User.js"
import PetSchema from "../../models/Pet.js"

const router = express.Router()

router.put("/edit-pet/:id", AuthVerifier, async (req, res) => {
  const id = req.params.id;      // Pet ID to update
  const user = req.user;         // Logged-in user
  const pet = req.body;          // Incoming updated data

  try {
    // Check if pet exists
    const existingPet = await PetSchema.findById(id);
    if (!existingPet) {
      return res.status(404).json({ success: false, msg: "Could not find pet" });
    }

    // Check ownership
    if (existingPet.userId.toString() !== user.id) {
      return res.status(403).json({ success: false, msg: "You are not allowed to edit this pet" });
    }

    // Update the pet
    const updatedPet = await PetSchema.findByIdAndUpdate(id, pet, { new: true });

    return res.json({ success: true, pet: updatedPet });
  
    } // Try block ends
    catch (err) {
    console.error(err);
    return res.status(500).json({success: false,msg: "Could not update pet. Please try again later.",});
    
    }
});


export default router