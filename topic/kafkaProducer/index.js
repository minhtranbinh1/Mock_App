// Kafka
const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"];


const topicCreatedProduce = async (post) => {
	const clientId = "topicCreate";
	const topic = "create-topic";
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

module.exports = { topicCreatedProduce }