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
const validateEditProfile = (req) => {
    const allowedFields = ["firstName", "lastName", "age", "gender"];
    return Object.keys(req.body).every((field) => allowedFields.includes(field));
};

const validateChangePassword = (req) => {
    const allowedFields = ["oldPassword", "newPassword"];
    const keys = Object.keys(req.body);

    if (keys.length !== 2 || !keys.every((field) => allowedFields.includes(field))) {
        return false;
    }

    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return false;
    }
    if (!validator.isStrongPassword(newPassword)) {
        return false;
    }
    if (oldPassword === newPassword) {
        return false;
    }
    return true;
};

module.exports = {
    validationData,
    validateEditProfile,
    validateChangePassword,
};
