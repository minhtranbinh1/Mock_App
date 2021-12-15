const { Kafka } = require("kafkajs")

const brokers = ["localhost:9092"]
const Post = require('../models/Post.Model')
const { postCreatedProduce } = require('../kafkaProducer/index')

const listenFromCrawler = async()=>{
    const clientId = "crawDataPostService";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "crawl-data";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const newPost = JSON.parse(message.value)
                const { _id,title,content,user,createdAt,updatedAt } = newPost;
                const post = new Post({_id,title,content,user,createdAt,updatedAt})
                await post.save();
                postCreatedProduce(newPost)
            } catch (error) {
                console.log(error)
            }

		},
	})
}





module.exports = { 
    listenFromCrawler
}