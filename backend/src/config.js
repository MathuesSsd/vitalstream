import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT || 3001),
  patientsDbUrl: process.env.PATIENTS_DB_URL,
  vitalsDbUrl: process.env.VITALS_DB_URL,
  mqttUrl: process.env.MQTT_URL || 'mqtt://localhost:1883',
  mqttTopic: process.env.MQTT_TOPIC || 'vitalstream/+/vitals',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
