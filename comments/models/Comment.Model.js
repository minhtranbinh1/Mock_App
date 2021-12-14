const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const CommentSchema = new mongoose.Schema(
  {
    user:{type: Schema.Types.ObjectId, required: true},
    topic: {type: Schema.Types.ObjectId, required: true},
    content: {type: String, required: true},
    postId: {type: Schema.Types.ObjectId, required: true}
    },
  { timestamps: true}
);

module.exports = mongoose.model("comments", CommentSchema,"Comments");