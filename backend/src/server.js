import http from 'node:http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { config } from './config.js';
import { closeDatabases, patientsDb } from './db.js';
import { startMqtt, stopMqtt } from './mqtt.js';
import {
  createPatient, deletePatient, getPatientById, listPatients, updatePatient
} from './repositories/patients.js';
import { getOverview, historyByPatient, latestByPatient } from './repositories/vitals.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(message) {
  const serialized = JSON.stringify(message);
  for (const socket of wss.clients) {
    if (socket.readyState === 1) socket.send(serialized);
  }
}

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'ws.connected', data: { connectedAt: new Date().toISOString() } }));
});

app.get('/api/health', async (_req, res) => {
  try {
    await patientsDb.query('SELECT 1');
    res.json({ ok: true, service: 'vitalstream-api' });
  } catch {
    res.status(503).json({ ok: false });
  }
});

// Auth simples para protótipo acadêmico.
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body ?? {};
  if (username === 'admin' && password === 'admin123') {
    return res.json({ token: 'demo-token', user: { name: 'Administrador', role: 'Atendimento' } });
  }
  return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
});

app.get('/api/patients', async (_req, res) => {
  try {
    res.json(await listPatients());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado.' });

    const [latest, history] = await Promise.all([
      latestByPatient(patient.id),
      historyByPatient(patient.id, req.query.limit)
    ]);

    res.json({ patient, latest, history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    if (!req.body?.name?.trim()) return res.status(400).json({ message: 'Nome é obrigatório.' });
    const patient = await createPatient(req.body);
    broadcast({ type: 'patient.created', data: patient });
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/patients/:id', async (req, res) => {
  try {
    if (!req.body?.name?.trim()) return res.status(400).json({ message: 'Nome é obrigatório.' });
    const patient = await updatePatient(req.params.id, req.body);
    if (!patient) return res.status(404).json({ message: 'Paciente não encontrado.' });
    broadcast({ type: 'patient.updated', data: patient });
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  try {
    const deleted = await deletePatient(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Paciente não encontrado.' });
    broadcast({ type: 'patient.deleted', data: deleted });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/dashboard', async (_req, res) => {
  try {
    const patients = await listPatients();
    const live = await getOverview(patients.map((p) => p.id));
    const byPatient = new Map(live.map((row) => [row.patient_id, row]));
    const cards = patients.map((patient) => ({ patient, latest: byPatient.get(patient.id) ?? null }));
    const summary = cards.reduce((acc, item) => {
      const status = item.latest?.status || 'normal';
      acc[status] += 1;
      if (item.patient.active && item.patient.device_id) acc.activeWristbands += 1;
      if (item.latest) acc.monitored += 1;
      return acc;
    }, { normal: 0, atencao: 0, perigo: 0, activeWristbands: 0, monitored: 0 });

    summary.alerts = summary.atencao + summary.perigo;
    res.json({ summary, patients: cards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

startMqtt((message) => broadcast(message));

server.listen(config.port, () => {
  console.log(`[HTTP] VitalStream em http://localhost:${config.port}`);
});

async function shutdown(signal) {
  console.log(`\n[APP] encerrando (${signal})...`);
  await stopMqtt();
  await closeDatabases();
  server.close(() => process.exit(0));
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
