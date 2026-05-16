const express = require("express");
const { validationData } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async(req,res)=>{
    // validate the data
    //encrypt the data
    
   
try {
    validationData(req);
    const {firstName, lastName, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
        firstName, lastName, email, password: passwordHash,
    })
   await  user.save();
    res.send("user added successully")
    console.log(res,"req")
} catch (error){
    res.status(400).send("Error: " + error.message)
}
})

authRouter.post("/login", async (req,res)=>{
    try{
    const {email,password} = req.body

    const user = await User.findOne({email:email});
    if(!user){
        throw new Error("email is invalid ")
    }
    const isPasswordvalid = await user.validatePassword(password);
    if(isPasswordvalid){
        
        const token = await user.getJWT();
        res.cookie("token",token)
        res.send("login successfull")
    }
    else {
        throw new Error("invalid credentails")
    }
} catch (error){
    res.status(400).send("Error: " + error.message)
}
    
})
module.exports = authRouter;