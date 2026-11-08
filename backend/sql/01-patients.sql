\connect vitalstream_patients;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  phone VARCHAR(30),
  email VARCHAR(180),
  emergency_phone VARCHAR(30),
  birth_date DATE,
  age INTEGER,
  device_id VARCHAR(80) UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_patients_active ON patients(active);
CREATE INDEX IF NOT EXISTS idx_patients_device_id ON patients(device_id);
