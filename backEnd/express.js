import express from "express"
import mongoose from "mongoose"
import cookie from "cookie-parser"
import dotenv from "dotenv"
import cors from "cors"
import token from "jsonwebtoken"
import OpenAI from "openai";

// IMPORTS FOR ROUTES
import LoginRoute from "./routes/Login.js"
import RegisterRoute from "./routes/Register.js"
import LogoutRoute from "./routes/Logout.js"
import VerifyRoute from "./routes/Verify-Account.js"
import SecureRoute from "./routes/SecureRoute.js"
// Import for VetFinder Page
import VetFinderPage from "./routes/VetPage.js"

// IMPORTS FOR MODIFIER ROUTES
import AddPet from "./routes/modifiers/AddPet.js"
import EditPet from "./routes/modifiers/EditPet.js"
import DeletePet from "./routes/modifiers/DeletePet.js"
// IMPORT FOR USER MODIFIER ROUTE
import EditProfile from "./routes/modifiers/EditProfile.js" 
import ChangePassword from "./routes/modifiers/ChangePassword.js"
import ProfilePicture from "./routes/modifiers/ProfilePicture.js"
import ForgotPassword from "./routes/modifiers/ForgotPassword.js"

// IMPORT FOR AI-CHAT ROUTE
import OpenAiChat from "./routes/OpenAiChat.js"


//IMPORTS FOR DATABASE MODELS

const app = express()


// to able to use api data
app.use(express.json())
app.use(cookie())



// setup corse for data transfer and include credentials for http-only cookie
app.use(cors({origin: "http://localhost:5173", credentials: true}))


// initialize dotenv
dotenv.config()



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export default openai;




// USE ROUTES
app.use(RegisterRoute)
app.use(VerifyRoute)
app.use(LoginRoute)
app.use(SecureRoute)
app.use(LogoutRoute)

app.use(VetFinderPage)
// USE MODIFIER ROUTES
app.use(AddPet)
app.use(EditPet)
app.use(DeletePet)
app.use(EditProfile)
app.use(ChangePassword)
app.use(ProfilePicture)
app.use(ForgotPassword)

app.use(OpenAiChat)


// Connect to mongoDB 
const mongoURI = process.env.mongoose;
mongoose.connect(mongoURI)
.then(console.log("MongoDB connected"))
.catch((err)=> console.log(`MongoDB could not connect ${err}`))



// setup backend port and listen
const backendPort = process.env.PORT;

app.listen(backendPort, ()=>{
    try{
        console.log(`server runs on http://localhost:${backendPort}`);
        
    }
    catch(err){
        console.log(`express server error: ${err}`);
        
    }
})