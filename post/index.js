const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3002;
const db = require('./config/db/index')
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());


const { postCreatedProduce,
        postUpdateProduce,
        postRemoveProduce
} = require('./kafkaProducer/index')
const Post = require('./models/Post.Model')
const { auth,authorization } = require('./middlewares/Auth')

// routes
// add post
app.post('/api/post',auth,authorization,async (req, res) => {
    const { title,content,user } = req.body;
    const newPost = new Post({title,content,user})
    try {
        postCreatedProduce(newPost);
        await newPost.save();
        res.status(200).json({success: true, message:"created Post successfully",data: newPost})
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error});
    }
})
// update the post
app.put('/api/post/:id',auth,authorization,async(req, res)=>{
    const postId = req.params.id;
    const { title,content } = req.body;
    try {
        const updatePost = await Post.findByIdAndUpdate(postId,{title:title,content:content});
        if(!updatePost) return res.status(400).json({success: false, message:"Don't have a post"})
        const updated = await Post.findOne({_id:postId});
        postUpdateProduce(updated);
        res.status(200).json({success:true, message:"Updated post successfully",data: updated})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error});
    }
})
// delete post by id
app.delete('/api/post/:id',auth,authorization,async function(req, res){
    const postId = req.params.id;
    try {
        const deleteItem = await Post.findByIdAndRemove(postId);
        if(!deleteItem) return res.status(404).json({success: false,message:"Delete failed"});
        const deleteCmtOfPost = await axios.delete(`http://localhost:3005/api/comment/post/${postId}`)
        if(!deleteCmtOfPost.data.success) return res.status(404).json({success: false,message:"cannot delete comment of this post"});
        const deleteTopicOfPost = await axios.delete(`http://localhost:3004/api/topic/post/${postId}`)
        if(!deleteTopicOfPost.data.success) return res.status(404).json({success: false,message:"cannot delete Topics of this post"});
        postRemoveProduce({postId})
        return res.status(200).json({success: true,message:"post delete successfully",deleteItem});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error});
    }
})


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});