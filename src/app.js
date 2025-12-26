const express = require("express");

const app  = express();
const { adminAuth, userAuth } = require("./middlewares/auth");


// app.use("/",(err,req,res)=>{
//     if(err){
//         res.status(500).send("something went wrong")
//     }
    
// })
app.use("/getuserdata",(req,res)=>{
// try{
throw new Error("user not found")
res.send("user is done")
//     throw new Error("user not found")
// } catch (error){
//     res.status(500).send("user not found")
// }
})
app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
    
})

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

app.listen(3000,()=>{
    console.log("server is running on port")
}
)
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