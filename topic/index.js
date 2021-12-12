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

const { topicCreatedProduce } = require('./kafkaProducer/index')
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


app.listen(PORT, function(){
    db.connect();
    console.log('service listening on port ' + PORT);
});