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

module.exports = { postCreatedProduce }