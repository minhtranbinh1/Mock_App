const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const PostSchema = new mongoose.Schema(
  {
    title:{type: String, required: true},
    content: {type: String, required: true},
    user: {type: Schema.Types.ObjectId, required: true},
    },
  { timestamps: true}
);

module.exports = mongoose.model("posts", PostSchema,"Posts");