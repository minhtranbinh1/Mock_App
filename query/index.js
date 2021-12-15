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
const { userCreateConsume,
        postCreateConsume,
        topicCreateConsume,
        commentCreateConsume,
        commentUpdateConsume,
        commentDeleteConsume,
        topicUpdateConsume,
        topicDeleteConsume,
        postUpdateConsume,
        postDeleteConsume
    } = require('./kafkaConsumer/kafka')
const Post = require('./models/Post.Model')


// routes
app.get('/api/posts/:id',async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await Post.findOne({_id:postId}).populate([{
            path: 'user',
            select:
                ['email', 'username','avatar','role']
        },{
            path: 'listTopic',
            populate:[{
                path: 'user',
                select: 
                    ['email', 'username','avatar','role']
            },{
                path: 'listComments',
                populate:{
                    path: 'user',
                    select: 
                    ['email', 'username','avatar','role']
                },
                select: 
                    ['user', 'content']
            }],
            select:
                ['title', 'postId','textHighlight','user']
        }])
        return res.status(200).json({success: true,message: 'Get post successfully', post})
    } catch (error) {
        return res.status(500).json({error: error})
    }
})
app.get('/api/getAllPosts',async function (req, res) {
    try {
        const post = await Post.find().populate([{
            path: 'user',
            select:
                ['email', 'username','avatar','role']
        },{
            path: 'listTopic',
            populate:[{
                path: 'user',
                select: 
                    ['email', 'username','avatar','role']
            },{
                path: 'listComments',
                populate:{
                    path: 'user',
                    select: 
                    ['email', 'username','avatar','role']
                },
                select: 
                    ['user', 'content']
            }],
            select:
                ['title', 'postId','textHighlight','user']
        }])
        return res.status(200).json({success: true,message: 'Get ALL post successfully', post})
    } catch (error) {
        return res.status(500).json({error: error})
    }
})
/// get post by category
app.get('/api/posts',async function (req, res) {
    const category = req.query.category
    try {
        if(!category) return res.status(400).json({success: true,message: 'Please enter category'})
        const posts = await Post.find({ category: category}).populate([{
            path: 'user',
            select:
                ['email', 'username','avatar','role']
        },{
            path: 'listTopic',
            populate:[{
                path: 'user',
                select: 
                    ['email', 'username','avatar','role']
            },{
                path: 'listComments',
                populate:{
                    path: 'user',
                    select: 
                    ['email', 'username','avatar','role']
                },
                select: 
                    ['user', 'content']
            }],
            select:
                ['title', 'postId','textHighlight','user']
        }])

        return res.status(200).json({success:true,message:"get post successfully",posts})
        
    } catch (error) {
        res.status(500).json({error: error});
    }
})


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
    userCreateConsume();
    postCreateConsume();
    topicCreateConsume();
    commentCreateConsume();
    commentUpdateConsume();
    commentDeleteConsume();
    topicUpdateConsume();
    topicDeleteConsume();
    postUpdateConsume();
    postDeleteConsume();
});