const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const TopicSchema = new mongoose.Schema(
  {
    title:{type: String, required: true},
    postId:{type: String, required: true},
    textHighlight:{type: String, required: true},
    user:{type: Schema.Types.ObjectId, ref: 'users'},
    listComments:[{type: Schema.Types.ObjectId, ref: 'comments'}]
    },
  { timestamps: true}
);

module.exports = mongoose.model("topics", TopicSchema,"Topics");