import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

exports.insertFromPubsub = functions.pubsub
	.topic('factory-sensors')
	.onPublish((message, context) => {
		console.log('The function was triggered at ', context.timestamp);

		// const messageBody = message.data ? Buffer.from(message.data, 'base64').toString() : null;
		// console.log('full message:', messageBody);

		let sensorLocation = '';
		try {
			sensorLocation = message.json.sensorLocation;
			console.log('sensor location', sensorLocation);
		} catch (e) {
			functions.logger.error('PubSub message not in JSON format. error:', e);
		}

		let sensorName = '';
		let temperature = '';
		let humidity = '';

		try {
			sensorName = message.attributes.sensorName;
			temperature = message.attributes.temperature;
			humidity = message.attributes.humidity;
			console.log('sensorName', sensorName);
			console.log('temperature', temperature);
			console.log('humidity', humidity);
		} catch (e) {
			functions.logger.error('PubSub message attributes error:', e);
		}

		var sensorInfo = {
			sensorLocation: sensorLocation,
			sensorName: sensorName,
			temperature: temperature,
			humidity: humidity,
		};

		return admin.firestore().collection('factorySensors').add(sensorInfo);
	});
