import express from "express"
import UserSchema from "../models/User.js"
import dotenv from "dotenv"
import {Resend} from "resend"
import crypto from "crypto"
import bcrypt from "bcrypt"

/*
 Things to be added here:
  1- input validation using the easiest sanitation library
  2- remove the duplicate gmail if statement 
  3- move the user save method inside the try block
  4- on the catch block add a if statement for code 11000 for duplicate email
  5- trim the name and email blocks.
 */ 

const router = express.Router()

// dotenv to use keys
dotenv.config()


// Setup Resend for sending mails
const resend = new Resend(process.env.resend)

router.post("/register", async (req,res)=>{

    //Get the body user variable
    const userObj = req.body;

    // If all input fields are full
   if(userObj.name && userObj.email && userObj.password){
    console.log(userObj);
    

    // crypt the password
    const cryptedPassword = await bcrypt.hash(userObj.password.trim(), 10)

    //  create verification url
    const token = crypto.randomBytes(32).toString("hex")


        try{

            // Create new user schema for new user if no duplicate email
            const NewUser = new UserSchema({
            nameSurname: userObj.name,
            email: userObj.email,
            password: cryptedPassword,
            verifyToken: token
            })

            //Save new user
            await NewUser.save();
            console.log("User saved");


            
            // After user is saved , send the verification link to users email
            await resend.emails.send({
            from: "onboarding@resend.dev",
            to: userObj.email,
            subject: "Pet plus verification link",
            html: `<a href="http://localhost:3000/verify?token=${token}"> Verification link for PetPlus </a>`
            })

            // Return good response if email sent
            res.status(200).json({success: true, msg: "Verification link sent to email."})
        }
        catch(err){

            if(err.errorResponse.code === 11000){
                res.status(400).json({success: false , msg: "Email already in use !"})
            }

        }

    
       }else{
     // Send bad response if some input fields are sent empty
        res.status(400).json({success: false, msg: "Please fill every field !"})

       }
    
    
   
    


})





export default router