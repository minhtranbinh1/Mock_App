const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const OTPSchema = new mongoose.Schema(
  {
    user:{
      type: Schema.Types.ObjectId,
      required: true,  
      ref:'users'
    },
    OTPCode:{type: String, required: true},
    expriedTime: {type: Date},
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTPs", OTPSchema,"OTPs");