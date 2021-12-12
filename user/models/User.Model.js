const mongoose = require("mongoose");
const avatarLink = process.env.AVATAR_EMPTY

const UserSchema = new mongoose.Schema(
  {
    email:{type: String, required: true},
    password:{type: String, required: true},
    username:{type: String, required: true},
    avatar:{type: String,default: avatarLink},
    role:{type: String, required: true,default:"user"}
  },
  { timestamps: true}
);

module.exports = mongoose.model("users", UserSchema,"Users");