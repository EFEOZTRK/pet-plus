import jwt from "jsonwebtoken"
// User jwt verification middleware for secure routes. which is all of them except login and register.

export const AuthVerifier = (req,res,next)=>{
    const token = req.cookies.token

    if(!token) return res.status(401).json({success: false , msg: "Session expired, Please login again"})

    try{
        
        const decoded = jwt.verify(token , process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
       return res.status(401).json({success: false , msg: "Session expired, Please login again"})
    }
    
}