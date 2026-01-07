import express from "express"
import openai from "../express.js"

const router = express.Router();
// Test if connection works later implement the whole logic 

router.get("/ai-health", async (req,res)=>{
    
    try{
    
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Can you hear me ?"
    });

    console.log(response);
    res.json({chatGptMsg:  response.output_text})

    }
    catch(err){
        console.error(err)
    }
    
    
    

})



export default router
