const { Kafka } = require("kafkajs")

const brokers = ["localhost:9092"]
const Comment = require('../models/Comment.Model')

const topicDeleteConsume = async()=>{
    const clientId = "topicRemovesv";
    const kafka = new Kafka({ clientId, brokers })
    const consumer = kafka.consumer({ groupId: clientId})
    const topic = "remove-topicsv";
    // Logic

	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		eachMessage: async ({ message }) => {
            try {
                const id = JSON.parse(message.value)
                const { _id } = id;
                await Comment.deleteMany({topic:_id});

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
                await Comment.deleteMany({postId:id});

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