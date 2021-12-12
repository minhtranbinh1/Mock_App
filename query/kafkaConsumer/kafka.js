const { Kafka } = require("kafkajs")

const brokers = ["localhost:9092"]
const User = require('../models/User.Model')
const Post = require('../models/Post.Model')
const Topic= require('../models/Topic.Model')
const Comment = require('../models/Comment.Model')


const userCreateConsume = async () => {
    const clientId = "userCreate";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "create-user";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const user = JSON.parse(message.value)
                const { username,password,role,_id,avatar,email } = user
                const newUser = new User({ _id:_id,username, password,email, avatar,role,avatar,email});
                await newUser.save();

            } catch (error) {
                console.log(error)
            }

		},
	})
}
const postCreateConsume = async () => {
    const clientId = "postCreate";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "create-post";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const post = JSON.parse(message.value)
                const { title,content,user,_id,createdAt,updatedAt } = post
                const newPost = new Post({_id,title,content,user,createdAt,updatedAt});
                await newPost.save();
            } catch (error) {
                console.log(error)
            }

		},
	})
}
const topicCreateConsume = async () => {
    const clientId = "topicCreate";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "create-topic";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const oneTopic = JSON.parse(message.value)
                const { title,postId,textHighlight,user,_id,createdAt,updatedAt } = oneTopic;
                const newTopic = new Topic({_id, title,postId,textHighlight,user,createdAt,updatedAt})
                await newTopic.save();
                const post = await Post.findOne({_id: postId});
                const listTopic = post.listTopic;
                listTopic.push(_id);
                await Post.findByIdAndUpdate(post._id,{listTopic})
            
            } catch (error) {
                console.log(error)
            }

		},
	})
}
const commentCreateConsume = async()=>{
    const clientId = "cmtCreate";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "create-cmt";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const oneCmt = JSON.parse(message.value)
                const { user,topic,_id,content,createdAt,updatedAt} = oneCmt;
                const newCmt = new Comment({ topic,_id,content,createdAt,updatedAt,user})
                await newCmt.save();
                const tp = await Topic.findOne({_id: topic});
                let listComments = tp.listComments;
                listComments.push(_id);
                await Topic.findByIdAndUpdate(tp._id,{listComments})
            } catch (error) {
                console.log(error)
            }

		},
	})
}


module.exports = { userCreateConsume,postCreateConsume,topicCreateConsume,commentCreateConsume }