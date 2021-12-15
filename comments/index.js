const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3005;
const db = require('./config/db/index')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const { postDeleteConsume,topicDeleteConsume } = require('./kafkaConsumer/index')

const Comment = require('./models/Comment.Model')
const { cmtCreatedProduce,
        cmtUpdateProduce,
        cmtRemoveProduce
}= require('./kafkaProducer/index');

const { auth,authorization } = require('./middlewares/Auth')

// Create a new comment
app.post('/api/comment',auth,authorization,async (req, res) => {
    const {user,topic,content,postId} = req.body;
    try {
        const newCmt = new Comment({user,topic,content,postId});
        await newCmt.save();
        cmtCreatedProduce(newCmt)
        res.status(200).json({success: true,message:"create comment for topic success",comment:newCmt});
        
    } catch (error) {
        res.status(500).json({success: false,message: error})
    }

})

// Edit comment for topic
app.put('/api/comment/:id',auth,authorization,async(req, res)=>{
    const id = req.params.id;
    const { content } = req.body;
    const user = req.user
    try {
        const owner =await Comment.findOne({_id:id,user:user._id})
        if(!owner) return res.status(404).json({success: false,message:"cannot Update Comment of other user"})
        await Comment.findOneAndUpdate({_id:id},{content:content});
        const updatedAtComment = await Comment.findById({_id:id});
        cmtUpdateProduce(updatedAtComment);
        res.status(200).json({success: true,message:"update comment for topic success",comment:updatedAtComment})
    } catch (error) {
        res.status(500).json({success: false,message: error})
    }
})

// delete cmt by id cmt
app.delete('/api/comment/:id',auth,authorization,async(req,res) => {
    const id = req.params.id;
    const user = req.user
    try {
        const owner =await Comment.findOne({_id:id,user:user._id})
        console.log(user._id);
        console.log(owner)
        if(!owner) return res.status(404).json({success: false,message:"cannot Delete Comment of other user"})
        
        cmtRemoveProduce({_id:id})
        await Comment.findByIdAndRemove(id);
        res.status(200).json({success: true,message:"delete success"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,message: error})
    }
})


app.listen(PORT, function(){
    db.connect();
    postDeleteConsume();
    topicDeleteConsume();
    console.log('service listening on port ' + PORT);
});