import * as functions from 'firebase-functions';

const admin = require('firebase-admin');
admin.initializeApp();
admin.firestore().settings({ ignoreUndefinedProperties: true });

exports.insertFromPubsub = functions.pubsub
	.topic('factory-sensors')
	.onPublish((message, context) => {
		console.log('The function was triggered at ', context.timestamp);

		let sensorLocation = '';
    let sensorReference = '';
		try {
			sensorLocation = message.json.sensorLocation;
      sensorReference = message.json.sensorReference;
		} catch (e) {
			functions.logger.error('PubSub message not in JSON format. error:', e);
		}

		let sensorName = '';
		let temperature = '';
		let humidity = '';
    let pressure = '';

		try {
			sensorName = message.attributes.sensorName;
			temperature = message.attributes.temperature;
			humidity = message.attributes.humidity;
      pressure = message.attributes.pressure;
      console.log('sensorName', sensorName);
      console.log('temperature', temperature);
      console.log('humidity', humidity);
      console.log('pressure', pressure);

		} catch (e) {
			functions.logger.error('PubSub message attributes error:', e);
		}

		const sensorInfo = {
			sensorLocation: sensorLocation,
      sensorReference: sensorReference,
			sensorName: sensorName,
			temperature: temperature,
			humidity: humidity,
      pressure: pressure
		};

		return admin.firestore().collection('factorySensors').add(sensorInfo);
	});
