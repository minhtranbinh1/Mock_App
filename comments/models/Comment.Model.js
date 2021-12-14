const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    user:{type: String, required: true},
    topic: {type: String, required: true},
    content: {type: String, required: true},
    postId: {type: String, required: true}
    },
  { timestamps: true}
);

module.exports = mongoose.model("comments", CommentSchema,"Comments");