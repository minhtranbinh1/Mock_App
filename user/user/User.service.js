const UserModel = require('../models/User.Model')
const { hashPassword } = require('../middlewares/passwordHandle/index');
const { ValidateEmail, ValidatePassword,ValidateUsername } = require('../Validates/validates');
const { userCreatedProduce } = require('../kafkaManage/index')

async function mailIsAlready(email) {
    try {
        const alreadyExistEmail = await UserModel.findOne({ email: email })
        if (alreadyExistEmail) return true;
        return false;
    } catch (e) {
        console.log(e);
        return e;
    }

}

async function createNewUser(res,username,email, password) {
    try {
        const newUser = await new UserModel({username, email, password})
        userCreatedProduce(newUser)
        // Create new user
        await newUser.save();
        return res.status(200).json({ success: true, message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(e);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

async function getInfoUser(id) {
    try {
        const user = await UserModel.findOne({ _id: id })
        if (!user) return { statusCode: 400, success: false, message: "User not found" }
        const { password, ...other } = user._doc
        return ({ statusCode: 200, success: true, message: "Get information successfully", user: other })
    } catch (error) {
        console.log(e);
        return ({ success: false, message: "Internal Server Error" });
    }
}


function validate(username,email, password, confirmPassword) {
    if (!username || !email || !password || !confirmPassword) return {
        sucess: false,
        message: "You entered missing information, please try again"
    };

    if (!ValidateEmail(email) && !ValidatePassword(password, confirmPassword)) return { 
        sucess: false, 
        message: "Invalid email and password and confirm-Password do not match" 
    };

    if (!ValidateEmail(email)) return {
        sucess: false,
        message: "Invalid email, please enter correct email format" 
    };

    if (!ValidatePassword(password, confirmPassword)) return {
        sucess: false,
        message: "password and confirm-Password do not match" 
    };
    if(!ValidateUsername(username)) return {
        sucess: false,
        message: "username must less than 5 characters"
    }

    return {sucess: true};
}

module.exports = { mailIsAlready, createNewUser, validate, getInfoUser }