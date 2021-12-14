const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3003;
const db = require('./config/db/index')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const axios = require('axios');

const { 
    topicCreatedProduce,
    topicUpdateProduce,
    topicRemoveProduce,
 } = require('./kafkaProducer/index')
const Topic = require('./models/Topic.Model')


app.post('/api/topics',async function(req, res){
    const { title,postId,textHighlight,user } = req.body;
    try {
        const newTopic = new Topic({title,postId,textHighlight,user})
        topicCreatedProduce(newTopic);
        await newTopic.save();
        res.status(200).json({success:true, message:"create one topic successfully", topic:newTopic});
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"internal server error", error:error})
    }

})
//// update topic
app.put('/api/topic/:id',async (req,res) => {
    const id = req.params.id;
    const { title } = req.body; 
    try {
        await Topic.findByIdAndUpdate(id,{title})
        const item = await Topic.findById(id)
        topicUpdateProduce(item)
        res.status(200).json({success:true, message:"update one topic successfully",item});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:"internal server error", error:error})
    }
    console.log(req.body);
})

// delete topic 
app.delete('/api/topic/:id',async(req,res)=>{
    const id = req.params.id;
    try {
        const response = await axios.delete(`http://localhost:3005/api/comment/topic/${id}`)
        if(response.data.success){
            const deleteItem = await Topic.findByIdAndDelete(id);
            topicRemoveProduce({_id:id});
            return res.status(200).json({success: true,message:"delete success",deleteItem})
        }else{
            return res.status(400).json({success: false,message:"delete failed"})
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,message: error})
    }
})

// delete topic by post id
app.delete('/api/topic/post/:id',async(req,res)=>{
    const postId = req.params.id;
    try {
        const deleteItems = await Topic.deleteMany({postId: postId});
        if(!deleteItems) return res.status(400).json({success:false,message:"Delete topic failed"})
        res.status(200).json({success:true,message:"Topic deleted successfully",deleteItems}) 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false,message: error})
    }
})

app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});