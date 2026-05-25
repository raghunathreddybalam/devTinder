const express = require("express");
const bcrypt = require("bcrypt");
const { validateEditProfile, validateChangePassword } = require("../utils/validation.js");

const profileRouter = express.Router();
const {  userAuth } = require("../middlewares/auth");


profileRouter.get("/profile",userAuth , async(req,res)=>{
    try{
       
    const user = req.user
    res.send(user)
    } catch (error){
        res.status(400).send("Error: " + error.message)
    }
})
profileRouter.patch("/profile/edit", userAuth , async(req,res)=>{
    try{
        if (!validateEditProfile(req)){
            throw new Error("invalid request")
        }
        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName}, your profile was updated successfully`)

    } catch(err){
        res.status(400).send("ERROR :" + err.message)
    }
     
})
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        if (!validateChangePassword(req)) {
            throw new Error("invalid request");
        }
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = req.user;

        const isOldPasswordValid = await loggedInUser.validatePassword(oldPassword);
        if (!isOldPasswordValid) {
            throw new Error("old password is incorrect");
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.send(`${loggedInUser.firstName}, your password was updated successfully`);
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});
module.exports =  profileRouter;