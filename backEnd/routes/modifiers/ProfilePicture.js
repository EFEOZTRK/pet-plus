import express from "express"
import userSchema from "../../models/User.js"
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

router.patch("/upload-profile-picture", AuthVerifier, upload.single("avatar"), async(req,res)=>{
        
    try{
        if(!req.file) return res.status(400).json({success: false, msg: "No file!"})

        const UserHasPictureAlready = await userSchema.findById(req.user.id)
        if(!UserHasPictureAlready) return res.status(404).json({success: false, msg: "User not found"})
        if(UserHasPictureAlready.profileImage?.publicId){
        try{
            await cloudinary.uploader.destroy(UserHasPictureAlready.profileImage.publicId)
        }
        catch(error){
            console.error("Cloudinary delete failed:", error);
        }
        }

        // Convert the image data into data URI
        const b64 = req.file.buffer.toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;

        const result = await cloudinary.uploader.upload(dataURI);
        
        await userSchema.findByIdAndUpdate(req.user.id, {$set: {profileImage:{publicId: result.public_id, url: result.secure_url}}}, {new: true})
        
        res.status(200).json({success: true, msg: "Profile picture updated", imageUrl: result.secure_url })
        

    }
    catch(err){
        console.error(err)
        return res.status(500).json({success:false , msg: "Server Error"})
    }
    
    
})


export default router
