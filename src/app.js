const express = require("express");

const app  = express();


app.get("/user/:userId/:name/:password",(req,res)=>{
    console.log(req.params)
    res.send("user is created")
})
app.get(/.*.fly$/,(req,res)=>{
    res.send("hellow fly")})
   
app.get("/user",(req,res)=>{
    console.log(req.query)
    res.send("namasthe bhai")
})
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
app.listen(3000,()=>{
    console.log("server is running on port")
}
)