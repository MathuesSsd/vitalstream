\connect vitalstream_vitals;

CREATE TABLE IF NOT EXISTS vital_readings (
  id BIGSERIAL PRIMARY KEY,
  patient_id UUID NOT NULL,
  device_id VARCHAR(80) NOT NULL,
  heart_rate INTEGER,
  spo2 NUMERIC(5,2),
  temperature NUMERIC(4,2),
  status VARCHAR(20) NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vitals_patient_time ON vital_readings(patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_device_time ON vital_readings(device_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_status_time ON vital_readings(status, recorded_at DESC);
