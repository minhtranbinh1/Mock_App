// Kafka
const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"];


const crawlData = async (post) => {
	const clientId = "crwalData";
	const topic = "crawl-data";
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


module.exports = { crawlData }