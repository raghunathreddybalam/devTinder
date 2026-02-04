 const jwt = require("jsonwebtoken")
 const User = require("../models/user")

 
 const userAuth =  async (req,res,next)=>{
    try{
    const cookies = req.cookies
    const {token} = cookies;
    if(!token){
        throw new Error("token is not valid")
    }
    const decodemssg = await jwt.verify(token,"secret");
    const {_id} = decodemssg;
    const user = await User.findById(_id)
    if (!user){
        throw new Error("user not found")
    }
    
    req.user = user;
    next()
} catch (error){
    res.status(400).send("Error: " + error.message)
}
}

// const adminAuth = (req,res,next)=>{
//     const token ="1234";
//     const isAuthorized =token === "1234";
//     if(!isAuthorized){
//         res.status(401).send("user is unauthorized")
//     }else{
//         next()
//     }
// }
module.exports ={userAuth}