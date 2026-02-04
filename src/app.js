const express = require("express");

const {validationData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const app  = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const {  userAuth } = require("./middlewares/auth");
const User = require("./models/user")
app.use(express.json())
app.use(cookieParser())



 
app.post("/login", async (req,res)=>{
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
app.get("/profile",userAuth , async(req,res)=>{
    try{
       
    const user = req.user
    res.send(user)
    } catch (error){
        res.status(400).send("Error: " + error.message)
    }
})


app.post("/signup", async(req,res)=>{
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
// get user by id 
// app.get ("/user",async (req,res)=>{
//     const userEmail = req.body.email;
//     try{
//         const user = await User.findOne({email:userEmail})
//         if(!user){
//             res.status(404).send("user not found")
//         }else{
//             res.send(user)
//         }
       
//         // const user =await User.find({email:userEmail})
//         // if(user.length === 0){
//         //     res.status(404).send("user not found")
//         // }else {
//         //     res.send(user);
//         // }
      
        
//     }catch(error){
//         res.status(400).send("something went wrong")
//     }

// })
// get user by by id
// app.get("/getbyid", async (req,res)=>{
//     const userpassword = req.body.password
//     try{
//     const user = await User.findOne({password:userpassword})
//     console.log(user)
//     res.send(user)
//     } catch{
//         res.status(400).send("something wrong")
//     }
// })
// delete user from db
// app.delete("/deleteuser", async (req,res)=>{
//     const userId = req.body.userId;
//     try{
//         const user = await User.findByIdAndDelete(userId)
//         res.send(user)
//     }catch{
//         res.status(400).send("something wrong") 
//     }
// })
// update the fields

// app.patch("/updateone/:userId",async (req,res)=>{
//     const userId = req.params?.userId
//     const data = req.body;
    
//     const ALLOWED_UPDATES =["gender","photoUrl","skills","password"]

//     const isAllowed = Object.keys(data).every((k)=>
//         ALLOWED_UPDATES.includes(k))
    
//     if(!isAllowed){
//         return res.status(400).send("Invalid fields! You can only update: " + ALLOWED_UPDATES.join(", "))
//     }
//     // Check skills length only if skills is provided
//     if(data.skills && data.skills.length > 7){
//         return res.status(400).send("Cannot add more than 7 skills")
//     }
//     try{
//     const user = await User.findByIdAndUpdate({_id:userId},data,{
//         runValidators:true
//     })

//     res.send(user)
//     }catch{
//         res.status(400).send("something wrong") 
//     }
// })
// get all users from db
// app.get("/feed",async (req,res)=>{
//     //const user = req.body;
//     try{
//         const user = await User.find({})
//         res.send(user)

//     } catch(error){
//  res.status(400).send("something went wrong")
//     }
// })
// // app.use("/",(err,req,res)=>{
// //     if(err){
// //         res.status(500).send("something went wrong")
// //     }
    
// // })
// app.use("/getuserdata",(req,res)=>{
// // try{
// throw new Error("user not found")
// res.send("user is done")
// //     throw new Error("user not found")
// // } catch (error){
// //     res.status(500).send("user not found")
// // }
// })
// app.use("/",(err,req,res,next)=>{
//     if(err){
//         res.status(500).send("something went wrong")
//     }
    
// })

//Separated auth middleware into `middlewares/auth.js` with `adminAuth` and `userAuth` that check a token and return 401 when unauthorized.

// app.use("/admin",adminAuth)
// app.use("/user/login",(req,res)=>{
//     res.send("lets see")
// })
// app.get("/admin/dashboard",
//     (req,res,next)=>{
//     res.send("you are authorized")
//     //next()
// })
// app.use("/user/profile", userAuth,(req,res)=>{
//     res.send("user is authorozed")
// })
// app.get("/admin/delete",(req,res)=>{
//     res.send(" you are also authorized and deleted")
// })
// app.use("/user",
//     (req,res,next)=>{
//     //res.send("i am next")
//     //next()
// })
connectDB()
.then(()=>{
    console.log("connected to mongo databaase")
    app.listen(3000,()=>{
        console.log("server is running on port")
    }
    )
})
.catch((err)=>{
    console.log("database not connected")
})

// Route params example: `app.get("/user/:userId/:name/:password", ...)`—use `req.params` to read path variables when the values are part of the URL and required to reach that route.

// app.get("/user/:userId/:name/:password",(req,res)=>{
//     console.log(req.params)
//     res.send("user is created")
// })
// app.get(/.*.fly$/,(req,res)=>{
//     res.send("hellow fly")})
   
// app.get("/user",(req,res)=>{
//     console.log(req.query)
//     res.send("namasthe bhai")
// })
// app.use("/test",(req,res)=>{
//     res.send(" hellow dev tinder")
// })
// app.get("/user",(req,res)=>{
//     res.send({firstName: "raghunath",lastname:"reddy"})
// })
// app.post("/user",(req,res)=>{
//     res.send("user is created")
// })
// app.delete("/user",(req,res)=>{
//     res.send("user is delted")
// })

// app.use("/test/rim",(req,res)=>{
//     res.send(" hellow abrack")
// })
// app.use("/test2/new",(req,res)=>{
//     res.send(" hellow old")
// })
// app.use("/",(req,res)=>{
//     res.send(" hellow dev listener")
// })