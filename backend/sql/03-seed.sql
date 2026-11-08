\connect vitalstream_patients;

INSERT INTO patients (id, name, cpf, phone, email, emergency_phone, age, device_id)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Alberto dos Santos', '000.000.000-01', '(11) 99999-1001', 'alberto@example.com', '(11) 98888-1001', 35, 'VS-0001'),
  ('22222222-2222-2222-2222-222222222222', 'Maria da Silva', '000.000.000-02', '(11) 99999-1002', 'maria@example.com', '(11) 98888-1002', 37, 'VS-0002'),
  ('33333333-3333-3333-3333-333333333333', 'João Pereira', '000.000.000-03', '(11) 99999-1003', 'joao@example.com', '(11) 98888-1003', 52, 'VS-0003')
ON CONFLICT (id) DO NOTHING;


\connect vitalstream_vitals;

INSERT INTO vital_readings (patient_id, device_id, heart_rate, spo2, temperature, status, recorded_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'VS-0001', 100, 98, 36.7, 'normal', NOW() - INTERVAL '2 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'VS-0001', 96, 98, 36.7, 'normal', NOW() - INTERVAL '1 minute'),
  ('22222222-2222-2222-2222-222222222222', 'VS-0002', 118, 96, 37.1, 'atencao', NOW() - INTERVAL '2 minutes'),
  ('22222222-2222-2222-2222-222222222222', 'VS-0002', 122, 95, 37.2, 'atencao', NOW() - INTERVAL '1 minute'),
  ('33333333-3333-3333-3333-333333333333', 'VS-0003', 72, 99, 36.5, 'normal', NOW() - INTERVAL '2 minutes'),
  ('33333333-3333-3333-3333-333333333333', 'VS-0003', 68, 98, 36.5, 'normal', NOW() - INTERVAL '1 minute');
