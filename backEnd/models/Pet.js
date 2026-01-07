import mongoose from "mongoose"


const schema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    name: {type: String, required: true},
    species: {type: String, required: true },
    breed: {type: String, required: true},
    age: {type: Number, required: true},
    color: {type: String, required: true},
    weight: {type: Number, required: true},
    
    vaccines: [
        {
            name: String,
            date: Date 

        }
    ],
},{timestamps: true})


const PetSchema = mongoose.model("Pet", schema)

export default PetSchema