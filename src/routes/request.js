const express = require("express");
const mongoose = require("mongoose");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

         const allowedStatus = ["intrested","ignored"];
         if(!allowedStatus.includes(status)){
            return res.status(400).json({message: " Invalid staus type" + status});
         }
         const toUser = await User.findById(toUserId);
         if(!toUser){
            return res.status(400).json({message : "user not found"});
         }
 const existingConnectionRequest = await ConnectionRequest.findOne({
    $or :[
        {fromUserId,toUserId},
        {fromUserId: toUserId,toUserId: fromUserId},
    ]
 })
 if (existingConnectionRequest) {
    return res.status(400).json({ message: "connection request already exists" });
 }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.json({
            message: "connection request sent successfully",
            data,
        });
    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
