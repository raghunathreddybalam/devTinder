const validator = require("validator");


 const validationData = (req)=>{
 const {firstName, lastName, email, password} = req.body
    if(!firstName || !lastName || firstName.length < 4 || firstName.length > 50){
        throw new Error("name is not valid")
    }else if (!validator.isEmail(email)){
        throw new Error("email is not valid")
    }else if (!validator.isStrongPassword(password)){
        throw new Error("password is not strong")
    }

}

module.exports ={
    validationData,  
}
