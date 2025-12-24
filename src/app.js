const express = require("express");

const app  = express();

app.use("/test",(req,res)=>{
    res.send(" hellow dev tinder")
})

app.use("/test2",(req,res)=>{
    res.send(" hellow new")
})
app.listen(3000,()=>{
    console.log("server is running on port")
}
)