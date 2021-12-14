const { Kafka } = require("kafkajs")
const { ObjectId } = require('mongodb');

const brokers = ["localhost:9092"]
const Topic = require('../models/Topic.Model')


const postDeleteConsume = async()=>{
    const clientId = "postRemove3";
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
                await Topic.deleteMany({postId: postId});

            } catch (error) {
                console.log(error)
            }

		},
	})
}



module.exports = { 
    postDeleteConsume
}