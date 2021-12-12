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

const Comment = require('./models/Comment.Model')
const { cmtCreatedProduce,
        cmtUpdateProduce,
        cmtRemoveProduce
}= require('./kafkaProducer/index');


// Create a new comment
app.post('/api/comment',async (req, res) => {
    const {user,topic,content} = req.body;
    try {
        const newCmt = new Comment({user,topic,content});
        await newCmt.save();
        cmtCreatedProduce(newCmt)
        res.status(200).json({success: true,message:"create comment for topic success",comment:newCmt});
        
    } catch (error) {
        res.status(500).json({success: false,message: error})
    }

})

// Edit comment for topic
app.put('/api/comment/:id',async(req, res)=>{
    const id = req.params.id;
    const { content } = req.body;
    try {
        await Comment.findOneAndUpdate({_id:id},{content:content});
        const updatedAtComment = await Comment.findById({_id:id});
        cmtUpdateProduce(updatedAtComment);
        res.status(200).json({success: true,message:"update comment for topic success",comment:updatedAtComment})
    } catch (error) {
        res.status(500).json({success: false,message: error})
    }
})
// Delete comment for topic
app.delete('/api/comment/:id',async(req,res) => {
    const id = req.params.id;
    try {
        const deleteItem = await Comment.findByIdAndDelete(id);
        cmtRemoveProduce({_id:id});
        res.status(200).json({success: true,message:"delete success",deleteItem})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,message: error})
    }
})


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});