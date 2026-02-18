import mongoose from "mongoose"



const schema = new mongoose.Schema({
    nameSurname: String,
    email: {type: String, required: true , unique: true},
    password: {type: String, required: true},
    phone: {type: String, default: ""},
    profileImage: { url: {type: String, default: ""} , publicId:{type: String, default: ""} },
    isPremium: Boolean,
    chatGptTokens: {type: Number, default: 2000},
    isVerified: {type: Boolean , default: false},
    verifyToken: String,
    resetPasswordToken: {type: String},
    resetPasswordExpire: {type: Date} ,
    pets:[{type: mongoose.Schema.Types.ObjectId, ref:"Pet"}],
    isVeterinarian: {type: Boolean, default: false},

    
},{timestamps: true})



const UserSchema = mongoose.model("User", schema)



export default UserSchema