import React from 'react';
import StatusBadge from './StatusBadge.jsx';

export default function PatientCard({ item, onDetails }) {
  const { patient, latest } = item;
  return (
    <article className="patient-card" onClick={() => onDetails(patient.id)}>
      <div className="patient-card-top">
        <div className="avatar">{patient.name.slice(0, 1).toUpperCase()}</div>
        <div>
          <h3>{patient.name}</h3>
          <div className="muted">{patient.age ? `${patient.age} anos` : 'Idade não informada'}</div>
        </div>
        <StatusBadge status={latest?.status || 'normal'} />
      </div>
      <div className="vital-main">
        <strong>{latest?.heart_rate ?? '--'}</strong><span>bpm</span>
      </div>
      <div className="vital-grid">
        <div><span>SpO₂</span><strong>{latest?.spo2 ?? '--'}%</strong></div>
        <div><span>Temp.</span><strong>{latest?.temperature ?? '--'}°C</strong></div>
        <div><span>Pulseira</span><strong>{patient.device_id || '—'}</strong></div>
      </div>
      <button className="link-button" onClick={(event) => { event.stopPropagation(); onDetails(patient.id); }}>Ver detalhes →</button>
    </article>
  );
}
