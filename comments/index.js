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
const { cmtCreatedProduce } = require('./kafkaProducer/index');


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


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});