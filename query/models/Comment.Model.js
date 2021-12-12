const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CommentSchema = new mongoose.Schema(
  {
    user:{type: Schema.Types.ObjectId,ref:'users'},
    topic: {type: Schema.Types.ObjectId,ref:'topics'},
    content: {type: String, required: true},
    },
  { timestamps: true}
);

module.exports = mongoose.model("comments", CommentSchema,"Comments");