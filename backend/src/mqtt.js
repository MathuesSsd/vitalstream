import mqtt from 'mqtt';
import { config } from './config.js';
import { vitalsDb } from './db.js';
import { calculateStatus } from './status.js';

let mqttClient;
let onReading;

export function startMqtt(onReadingCallback) {
  onReading = onReadingCallback;
  mqttClient = mqtt.connect(config.mqttUrl, { reconnectPeriod: 2000 });

  mqttClient.on('connect', () => {
    console.log(`[MQTT] conectado em ${config.mqttUrl}`);
    mqttClient.subscribe(config.mqttTopic, { qos: 1 }, (error) => {
      if (error) console.error('[MQTT] erro ao assinar tópico:', error.message);
      else console.log(`[MQTT] assinando ${config.mqttTopic}`);
    });
  });

  mqttClient.on('error', (error) => console.error('[MQTT] erro:', error.message));

  mqttClient.on('message', async (topic, buffer) => {
    try {
      const payload = JSON.parse(buffer.toString());
      const [,, deviceId] = topic.split('/');

      const reading = {
        patientId: payload.patientId,
        deviceId: payload.deviceId || deviceId,
        heartRate: payload.heartRate == null ? null : Number(payload.heartRate),
        spo2: payload.spo2 == null ? null : Number(payload.spo2),
        temperature: payload.temperature == null ? null : Number(payload.temperature),
        timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date()
      };

      if (!reading.patientId || !reading.deviceId) {
        throw new Error('patientId e deviceId são obrigatórios');
      }

      const hasVital = [reading.heartRate, reading.spo2, reading.temperature].some(Number.isFinite);
      if (!hasVital) throw new Error('nenhum sinal vital numérico recebido');

      const status = calculateStatus(reading);

      const result = await vitalsDb.query(
        `INSERT INTO vital_readings
          (patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at`,
        [reading.patientId, reading.deviceId, reading.heartRate, reading.spo2, reading.temperature, status, reading.timestamp]
      );

      const saved = result.rows[0];
      onReading?.({
        type: 'vital.update',
        data: saved
      });
    } catch (error) {
      console.error('[MQTT] mensagem inválida:', error.message);
    }
  });
}

export async function stopMqtt() {
  if (!mqttClient) return;
  await new Promise((resolve) => mqttClient.end(false, {}, resolve));
}
