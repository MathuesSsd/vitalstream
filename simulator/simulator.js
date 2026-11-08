import mqtt from 'mqtt';

const broker = process.env.MQTT_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(broker);

const devices = [
  { patientId: '11111111-1111-1111-1111-111111111111', deviceId: 'VS-0001', heartRate: 82 },
  { patientId: '22222222-2222-2222-2222-222222222222', deviceId: 'VS-0002', heartRate: 118 },
  { patientId: '33333333-3333-3333-3333-333333333333', deviceId: 'VS-0003', heartRate: 68 }
];

function variation(base, spread = 5) {
  return Math.round(base + (Math.random() * spread * 2 - spread));
}

client.on('connect', () => {
  console.log(`Simulador MQTT conectado em ${broker}`);

  setInterval(() => {
    for (const device of devices) {
      const heartRate = variation(device.heartRate);
      const payload = {
        patientId: device.patientId,
        deviceId: device.deviceId,
        heartRate,
        spo2: Number((97 + Math.random() * 2).toFixed(1)),
        temperature: Number((36.5 + Math.random() * 0.8).toFixed(1)),
        timestamp: new Date().toISOString()
      };

      client.publish(`vitalstream/devices/${device.deviceId}/vitals`, JSON.stringify(payload), { qos: 1 });
      console.log(payload);
    }
  }, 3000);
});
