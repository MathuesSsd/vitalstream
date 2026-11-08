// Regras propositalmente simples para o protótipo acadêmico.
// Não representam protocolo clínico.
export function calculateStatus({ heartRate, spo2, temperature }) {
  let danger = false;
  let attention = false;

  if (Number.isFinite(heartRate)) {
    danger ||= heartRate < 45 || heartRate > 140;
    attention ||= heartRate < 55 || heartRate > 110;
  }

  if (Number.isFinite(spo2)) {
    danger ||= spo2 < 90;
    attention ||= spo2 < 94;
  }

  if (Number.isFinite(temperature)) {
    danger ||= temperature < 35 || temperature >= 40;
    attention ||= temperature < 36 || temperature >= 38;
  }

  if (danger) return 'perigo';
  if (attention) return 'atencao';
  return 'normal';
}
