import { patientsDb } from '../db.js';

export async function listPatients() {
  const result = await patientsDb.query(`SELECT * FROM patients ORDER BY name`);
  return result.rows;
}

export async function getPatientById(id) {
  const result = await patientsDb.query(`SELECT * FROM patients WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function createPatient(data) {
  const result = await patientsDb.query(
    `INSERT INTO patients (name, cpf, phone, email, emergency_phone, birth_date, age, device_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
     RETURNING *`,
    [data.name, data.cpf || null, data.phone || null, data.email || null, data.emergencyPhone || null,
      data.birthDate || null, data.age ?? null, data.deviceId || null]
  );
  return result.rows[0];
}

export async function updatePatient(id, data) {
  const result = await patientsDb.query(
    `UPDATE patients
        SET name = $1, cpf = $2, phone = $3, email = $4, emergency_phone = $5,
            birth_date = $6, age = $7, device_id = $8, active = $9, updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
    [data.name, data.cpf || null, data.phone || null, data.email || null, data.emergencyPhone || null,
      data.birthDate || null, data.age ?? null, data.deviceId || null, data.active ?? true, id]
  );
  return result.rows[0] ?? null;
}

export async function deletePatient(id) {
  const result = await patientsDb.query(`DELETE FROM patients WHERE id = $1 RETURNING id`, [id]);
  return result.rows[0] ?? null;
}
