const mongoose  =require("mongoose");

const connectDB = async ()=>{
    await  mongoose.connect("mongodb+srv://raghu9033_db_user:owUAR51cMfo7x1xt@raghunodejs.5vx2olv.mongodb.net/devTinder")

}

module.exports = connectDB