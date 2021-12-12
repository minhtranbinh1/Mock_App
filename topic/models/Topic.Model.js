const mongoose = require("mongoose");
const TopicSchema = new mongoose.Schema(
  {
    title:{type: String, required: true},
    postId:{type: String, required: true},
    textHighlight:{type: String, required: true},
    user:{type: String, required: true}
    },
  { timestamps: true}
);

module.exports = mongoose.model("topics", TopicSchema,"Topics");