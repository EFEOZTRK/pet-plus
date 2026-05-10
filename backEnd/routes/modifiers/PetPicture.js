import express from "express"
import petSchema from "../../models/Pet.js"
import {AuthVerifier} from "../AuthVerify.js"
import multer from "multer"
import cloudinary from "cloudinary"

// Configure multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024} // 5mb max limit for pp
})

//Configure cloudinary
cloudinary.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.CLOUD_KEY,
api_secret: process.env.CLOUD_SECRET
});


const router = express.Router()

router.patch("/upload-pet-picture", AuthVerifier, upload.single("avatar"), async(req,res)=>{
  
    try{
        const {petId} = req.body 
        if(!petId) return res.status(400).json({success: false, msg: "No pet id!"})
        if(!req.file) return res.status(400).json({success: false, msg: "No file!"})

        const PetHasPictureAlready = await petSchema.findById(petId)
        if(!PetHasPictureAlready) return res.status(404).json({success: false, msg: "Pet not found"})
        // Check if user owns this pet
        if(PetHasPictureAlready.userId.toString() !== req.user.id) return res.status(401).json({success: false, msg: "You don't own this pet!"})

        if(PetHasPictureAlready.petImage?.publicId){
        try{
            await cloudinary.uploader.destroy(PetHasPictureAlready.petImage.publicId)
        }
        catch(error){
            console.error("Cloudinary delete failed:", error);
        }
        }

        // Convert the image data into data URI
        const b64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI);
        
        await petSchema.findByIdAndUpdate(petId, {$set: {petImage:{publicId: result.public_id, url: result.secure_url}}}, {new: true})
        
        res.status(200).json({success: true, msg: "Pet picture updated", imageUrl: result.secure_url })
        

    }
    catch(err){
        console.error(err)
        return res.status(500).json({success:false , msg: "Server Error"})
    }
    
    
})


export default router