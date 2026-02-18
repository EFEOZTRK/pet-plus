import express from "express"
import UserSchema from "../models/User.js"

const router = express.Router()


router.get("/verify", async (req,res)=>{
    const token = req.query.token;

    try{
        // Get token , If token exists then search if a user has it , 
        // Then if it exists on a user, set isVerified = true, for that user
        // then set the token as undefined and route the user to login page.


        if(!token) return res.status(400).send("Invalid or missing token")

        const user = await UserSchema.findOne({verifyToken: token})

        if(!user) res.status(400).send("Invalid or missing token")

        user.isVerified = true;
        user.verifyToken = undefined
        await user.save();

        // Redirect to login page with a success message to be used on that page.
        return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`)

    }
    catch(err){
        console.log(err);
        return res.redirect("http://localhost:5173/login?verified=failed")

    }
    
    
})


export default router