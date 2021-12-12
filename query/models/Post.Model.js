const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const PostSchema = new mongoose.Schema(
  {
    title:{type: String, required: true},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true,ref: 'users'},
    listTopic:[{type: Schema.Types.ObjectId , ref:'topics'}],
  },
  { timestamps: true}
);

module.exports = mongoose.model("posts", PostSchema,"Posts");