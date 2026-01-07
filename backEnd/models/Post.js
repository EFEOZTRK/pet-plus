import mongoose, { mongo } from "mongoose";
import saveSchema from "./User";


const schema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    content: {type: String, required: true},
    images: [String],
    
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],

    comments: [{
        userId: {type: mongoose.Schema.Types.ObjectId, ref:  "User"} ,
        comment: String,
        createdAt: {type: Date, default: Date.now}
        
    }]

},{timestamps: true})


export default PostSchema = mongoose.model("Post", schema)