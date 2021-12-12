const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3002;
const db = require('./config/db/index')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());

const { postCreatedProduce } = require('./kafkaProducer/index')
const Post = require('./models/Post.Model')

// routes
app.post('/api/post',async (req, res) => {
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


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});