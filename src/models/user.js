const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName :{
        type : String,
        required :true,
        minLength :4,
        maxLength:50,
    },
    lastName : {
        type : String,
        required: true,
        minLength:2,
        maxLength:50,
    },
    email: {
        type : String,
        required: true, // mandatory field to store ,otherwise it will throw error 
        unique :true, //  not allowing duplicate things ,like emial should be diiferent for everyone
        trim: true, // removes the spaces from characters and stores in db
        lowercase : true, // it will store in lower case in db
    },
    password :{
        type : String
    },
    age :{
        type :Number,
        min :18,
    },
    gender :{
        type : String,
        validate(value){
            if(!["male","female","others"].includes(value))
                throw new Error(" enter correct gender")
        }
    },
    photoUrl:{
        type : String,
        default : "https://www.shutterstock.com/image-vector/isolated-object-avatar-dummy-symbol-260nw-1290296656.jpg"
    },
    skills:{
        type: [String]
    },
    about :{
        type : String,
        default :"this is default value"
    }
},{
    timestamps:true,
})
const User = mongoose.model("User", userSchema);
module.exports = User; 