// Kafka
const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"];


const postCreatedProduce = async (post) => {
	const clientId = "postCreate";
	const topic = "create-post";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(post),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}

const postUpdateProduce = async (postId) => {
	const clientId = "postUpdate";
	const topic = "update-post";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(postId),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}

const postRemoveProduce = async (postId) => {
	const clientId = "postRemove";
	const topic = "remove-post";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(postId),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}

module.exports = { postCreatedProduce,postUpdateProduce,postRemoveProduce }