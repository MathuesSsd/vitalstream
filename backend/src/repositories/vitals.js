import { vitalsDb } from '../db.js';

export async function latestByPatient(patientId) {
  const result = await vitalsDb.query(
    `SELECT id, patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at
       FROM vital_readings
      WHERE patient_id = $1
      ORDER BY recorded_at DESC
      LIMIT 1`,
    [patientId]
  );
  return result.rows[0] ?? null;
}

export async function historyByPatient(patientId, limit = 30) {
  const safeLimit = Math.min(Math.max(Number(limit) || 30, 1), 500);
  const result = await vitalsDb.query(
    `SELECT id, patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at
       FROM vital_readings
      WHERE patient_id = $1
      ORDER BY recorded_at DESC
      LIMIT $2`,
    [patientId, safeLimit]
  );
  return result.rows.reverse();
}

export async function getOverview(patientIds) {
  if (!patientIds.length) return [];
  const result = await vitalsDb.query(
    `SELECT DISTINCT ON (patient_id)
       patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at
       FROM vital_readings
      WHERE patient_id = ANY($1::uuid[])
      ORDER BY patient_id, recorded_at DESC`,
    [patientIds]
  );
  return result.rows;
}
