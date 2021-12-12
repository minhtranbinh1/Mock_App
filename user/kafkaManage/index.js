// Kafka
const { Kafka } = require("kafkajs")
const brokers = ["localhost:9092"];


const userCreatedProduce = async (user) => {
	const clientId = "userCreate";
	const topic = "create-user";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(user),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}

const updateUserProduce = async (info) => {

	const clientId = "userUpdate";
	const topic = "update-user";
	const kafka = new Kafka({ clientId, brokers })
	const producer = kafka.producer()
	await producer.connect()
    try {
		await producer.send({
				topic,
				messages: [
					{
					    value: JSON.stringify(info),
					},
				],
		})
		} catch (err) {
			console.error("could not write message " + err)
		}
}



module.exports = { userCreatedProduce,updateUserProduce }