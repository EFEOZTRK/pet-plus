import express from "express"
import openai from "../express.js"
import { AuthVerifier } from "./AuthVerify.js";
import UserSchema from "../models/User.js";
import multer from "multer";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/ai-health",AuthVerifier, upload.single("image"), async (req,res)=>{

    try {
      const user = req.user;

      const tokens = await UserSchema.findById(user.id).select("chatGptTokens");

      // Insufficient tokens
      if (tokens.chatGptTokens <= 0) {
        return res.status(403).json({ success: false, msg: "Insufficient tokens" });
      }

      // Parse messages (JSON or FormData)
      const messages =
        typeof req.body.messages === "string"
          ? JSON.parse(req.body.messages)
          : req.body.messages;

      if (!Array.isArray(messages) || messages.length < 1) {
        return res.status(400).json({ success: false, msg: "No messages provided" });
      }

      // Sanitized user messages
      let openAiInput = messages.map(m=>({
        role: m.role,
        content: m.content
      })); 

        if (req.file) {
        const base64Image = req.file.buffer.toString("base64");

        const lastUserMessage = messages[messages.length - 1];

        openAiInput = [
            ...messages.slice(0, -1),
            {
            role: "user",
            content: [
                { type: "input_text", text: lastUserMessage.content },
                {
                type: "input_image",
                image_url: `data:${req.file.mimetype};base64,${base64Image}`
                }           
            ]
            }
        ];
        }

      // OpenAI request
      const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: openAiInput
      });

      // Token update
      tokens.chatGptTokens = Math.max(
        0,
        tokens.chatGptTokens - response.usage.total_tokens
      );
      await tokens.save();

      return res.status(200).json({
        success: true,
        message: response.output_text,
        remainingTokens: tokens.chatGptTokens
      });

    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, msg: "AI service error" });
    }
  
    
})



export default router
