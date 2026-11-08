import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const patientsDb = new Pool({
  connectionString: config.patientsDbUrl,
  max: 10
});

export const vitalsDb = new Pool({
  connectionString: config.vitalsDbUrl,
  max: 15
});

export async function closeDatabases() {
  await Promise.all([patientsDb.end(), vitalsDb.end()]);
}
