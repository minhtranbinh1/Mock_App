// Model
const User = require('../models/User.Model');
const OTPModel = require('../models/Otp.Model');
const { hashPassword,checkPassword } = require('../middlewares/passwordHandle/index');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { transporter } = require('../mailService/index')
const {  isExpiredOTP  } = require('../middlewares/timeOtpService/timeHandle')
const { ValidatePassword } = require('../Validates/validates');
const { mailIsAlready,createNewUser,validate,getInfoUser } = require('./User.service')
const { userCreatedProduce,updateUserProduce } = require('../kafkaManage/index')


class UserController{
    async createUser(req, res){
        const { username,email,password,confirmPassword } = req.body;
        const checkData = validate(username,email,password,confirmPassword)
        if(!checkData.sucess) return res.status(400).json({success:false,message:checkData.message})
        try {
            // Check email 
            const alreadyEmail = await mailIsAlready(email);
            if(!alreadyEmail){
                const passwordHashed = await hashPassword(password)
                return createNewUser(res,username,email,passwordHashed);
            } 
            return res.status(400).json({success:false,message:"Email already exist in system"});
        } catch (error) {
            console.log(error)
            return res.status(500).json({success:false,message:"Internal Server Error"})
        }
    
    }


    async login(req, res) {
        const { email, password } = req.body
        try {
            const user = await User.findOne({email: email})
            if(!user) return res.status(400).json({success:false,message:"User does not exist"})
            const check = await checkPassword(password,user.password)
            if(!check) return res.status(400).json({success:false,message:"Invalid Password"})
            const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN_SECRET)
            return res.status(200).json({success:true,message:"Login successfully",user,accessToken})

        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }



    async getUser(req, res) {
        const id = req.userId;
        try {
            const find = await getInfoUser(id)
            if(!find.success) return res.status(find.statusCode).json({success:find.success,message:find.message})
            return res.status(find.statusCode).json({success:find.success,message:find.message,user:find.user})
        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }


      async forgotPassword(req, res) {
        const { email } = req.body
        try {
            const user = await User.findOne({email: email})
            if(!user) return res.status(400).json({success:false,message:"Email not found, please try again"})
            // generate one OTP code
            const OTPCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,digits: false})
            // config mail
            const mail = {
                    from: process.env.GMAIL_USER, 
                    to: `${email}`, 
                    subject: 'You forgot your password, this email will help you reset your password',
                    html: `<h1>Forgot your password</h1> <br/> <p> this is an OTP code sent from the system, enter it in the OTP Code key in the json document with the new password and call the API to the path http://localhost:3000/api/user/reset-password with method PUT (Have four information you need provide "otp","email","newPassword","confirmPassword" ) to reset your password</p><br/><p>OTP code: <b>${OTPCode}<b/> ---- <b>OTP is valid for 1 minutes<b/><p/>` 
            };
            // Check the OTP, if it exists before, update the OTPCode.Otherwise, create a new OTPCode
            const prevOTP = await OTPModel.findOne({user: user._id})
            if(prevOTP){
                // send mail
                transporter.sendMail(mail,async function(error, info) {
                    if (error) { 
                        return res.status(400).json({success: false, message:"has errors on Server",error}) 
                    } else {    
                        // Update OTPCode
                        const OTPUpdate = await OTPModel.findByIdAndUpdate(prevOTP._id,{OTPCode:OTPCode})
                        await OTPUpdate.save();
                        return res.status(200).json({success:true,message:`New OTP code has sent to ${email},please check it for reset your password `,OTPCode:OTPCode,expriedTime: '30 seconds'})
                    }
                }); 
            }else{
                // send mail with OTPCode
                transporter.sendMail(mail,async function(error, info) {
                    if (error) { 
                        return res.status(400).json({success: false, message:"has errors on Server",error})
                    } else {    
                        console.log('Email sent: ' + info.response);
                        // Create one OTP code
                        const newOtp = new OTPModel({user: user._id,OTPCode: OTPCode})
                        await newOtp.save();
                        return res.status(200).json({success:true,message:`New OTP code has sent to ${email},please check it for reset your password `,OTPCode:OTPCode,expriedTime: '30 seconds'})
                    }
                });
            }
            } catch (error) {
                return  res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }


    async resetPassword(req, res){
        const { otp, email,newPassword,confirmPassword } = req.body
        try {
            // Check
            if(!otp) return res.status(400).json({success:false,message:"Please enter your otp code"});

            if(!email) return res.status(400).json({success:false,message:"Please enter your email"});

            if(!ValidatePassword(newPassword,confirmPassword)) return res.status(400).json({success:false,message:"password and confirm-Password do not match"});

            // find OTP on DB
            const OTPCodeDB = await OTPModel.findOne({OTPCode:otp}).populate({
                path: 'user',
                select:
                  'email',
            });

            // handle when no have OTP on DB
            if(!OTPCodeDB) return res.status(400).json({success:false,message:"OTP code is not available,please try again"});

            const { user,updatedAt } = OTPCodeDB;

            // Check
            if(email!==user.email) return res.status(400).json({success:false,message:"email is not a valid"});

            // Check expried OTP code
            if(isExpiredOTP(updatedAt)) return res.status(400).json({success:false,message:"OTP code is expired, please create one new OTP code"});

            // Success, implement update User
            const passwordHashed = await hashPassword(newPassword)
            await User.findByIdAndUpdate(user._id,{password:passwordHashed})
            // await updateUserProduce({email,password:passwordHashed})
            // after change password OTP has been remove
            await OTPModel.findByIdAndDelete(OTPCodeDB._id)
            return res.status(200).json({success:true,message:"Password has changed",user:{email,newPassword}});
            
        } catch (error) {
            console.log(error);
            res.status(500).json({success:false,message:"Internal Server Error"})
        }
    }
}
module.exports = new  UserController;