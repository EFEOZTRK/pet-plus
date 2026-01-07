import express from "express"
import openai from "../express.js"

const router = express.Router();


router.get("/ai-health", async (req,res)=>{
    
    try{
    
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: "Selam , kopegim biraz isal olmus bunu evde gecirmenin basit yontemleri nelerdir veterine gitmeden once "
    });

    console.log(response);
    res.json({chatGptMsg:  response.output_text})

    }
    catch(err){
        console.error(err)
    }
    
    
    

})



export default router