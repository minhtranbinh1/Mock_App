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

const cmtUpdateProduce = async (cmt) => {
	const clientId = "cmtUpdate";
	const topic = "update-cmt";
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

const cmtRemoveProduce = async (id) => {
	const clientId = "cmtRemove";
	const topic = "remove-cmt";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(id),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}


module.exports = { cmtCreatedProduce,cmtUpdateProduce,cmtRemoveProduce }