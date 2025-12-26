 const adminAuth = (req,res,next)=>{
    const token ="1234";
    const isAuthorized =token === "1234";
    if(!isAuthorized){
        res.status(401).send("unauthorized")
    }else{
        next()
    }
}

const userAuth = (req,res,next)=>{
    const token ="1234";
    const isAuthorized =token === "1234";
    if(!isAuthorized){
        res.status(401).send("user is unauthorized")
    }else{
        next()
    }
}
module.exports ={adminAuth,userAuth}