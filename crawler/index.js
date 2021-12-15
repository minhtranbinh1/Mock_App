const express = require('express');
const app = express();
const env = require('dotenv');
env.config();
const PORT = process.env.PORT || 3006;
const db = require('./config/db/index')
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
const axios = require('axios');
const Post = require('./models/Post.Model');
const { auth,authorization } = require('./middlewares/Auth')
const { crawlData } = require('./kafka/Producer')

app.get('/api/crawl',auth,authorization,async function(req, res){
    const category = req.query.category
    try {
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.API_KEY}`)
        const listPosts = response.data.articles
        listPosts.forEach(async (post)=> {
            let newPost = new Post({
                title: post.title,
                content: post.content || "No Content",
                user: req.user._id,
                category: category
            })
            crawlData(newPost);
            await newPost.save();
            
        })
        res.status(200).json({success:true,message:"crawl data from API success"})
        
    } catch (error) {
        console.error(error)
        res.status(500).json({success: false,message: error})
    }


})


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});