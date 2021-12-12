// Kafka
const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"];


const cmtCreatedProduce = async (cmt) => {
	const clientId = "cmtCreate";
	const topic = "create-cmt";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(cmt),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}

module.exports = { cmtCreatedProduce }