import express from "express"
import { AuthVerifier } from "./AuthVerify.js"
import UserSchema from "../models/User.js"

// This is the route that checks if user is logged in and if so I will send the user data to be used.
// Keep it in a file that wraps the app so I can access the user information from any page and render them.

const router = express.Router()

router.get('/me', AuthVerifier, async (req,res)=>{
  
  const user = await UserSchema.findById(req.user.id).populate("pets").select("-password")
  return  res.json({success: true, user});

} )

export default router