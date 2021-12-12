const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const UserSchema = new mongoose.Schema(
  {
    _id:{type: Schema.Types.ObjectId, required: true},
    email:{type: String, required: true},
    password:{type: String, required: true},
    username:{type: String, required: true},
    avatar:{type: String},
    role:{type: String, required: true,default:"user"}
  },
  { timestamps: true,_id: false}
);

module.exports = mongoose.model("users", UserSchema,"Users");