const { Kafka } = require("kafkajs")
const { ObjectId } = require('mongodb');

const brokers = ["localhost:9092"]
const Comment = require('../models/Comment.Model')

const topicDeleteConsume = async()=>{
    const clientId = "topicRemove2";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "remove-topic";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const id = JSON.parse(message.value)
                const { _id } = id;
                console.log(_id)
               await Comment.deleteMany({topic:topicId});

            } catch (error) {
                console.log(error)
            }

		},
	})
}

const postDeleteConsume = async()=>{
    const clientId = "postRemove2";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "remove-post";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const id = JSON.parse(message.value)
                const { postId } = id;
                await Comment.deleteMany({postId:postId});

            } catch (error) {
                console.log(error)
            }

		},
	})
}



module.exports = { 
    topicDeleteConsume,
    postDeleteConsume
}