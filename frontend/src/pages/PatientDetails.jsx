import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatusBadge from '../components/StatusBadge.jsx';

export default function PatientDetails({ data, onBack }) {
  if (!data) return null;
  const { patient, latest, history } = data;
  const chartData = history.map((row) => ({ time: new Date(row.recorded_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), bpm: row.heart_rate }));
  return (
    <div>
      <button className="back-button" onClick={onBack}>← Voltar</button>
      <header className="page-header"><div><h1>Detalhes do Paciente</h1><p>Histórico e dados recebidos da pulseira.</p></div></header>
      <section className="detail-hero">
        <div className="avatar large">{patient.name.slice(0,1).toUpperCase()}</div>
        <div><h2>{patient.name}</h2><p>{patient.age ? `${patient.age} anos` : 'Idade não informada'} · Pulseira {patient.device_id || 'não vinculada'}</p></div>
        <StatusBadge status={latest?.status || 'normal'} />
        <div className="current-vital"><strong>{latest?.heart_rate ?? '--'}</strong><span>bpm</span><small>Frequência Cardíaca Atual</small></div>
      </section>
      <section className="detail-grid">
        <div className="chart-card"><div className="section-title"><h2>Frequência Cardíaca por Período</h2><span>{history.length} leituras</span></div><div className="chart"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData}><XAxis dataKey="time" /><YAxis domain={['dataMin - 10', 'dataMax + 10']} /><Tooltip /><Line type="monotone" dataKey="bpm" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></div>
        <div className="history-card"><div className="section-title"><h2>Últimas leituras</h2></div><div className="reading-list">{history.slice().reverse().slice(0, 8).map((row) => <div className="reading" key={row.id}><span>{new Date(row.recorded_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span><strong>{row.heart_rate ?? '--'} bpm</strong><em>{row.spo2 ?? '--'}% SpO₂</em></div>)}</div></div>
      </section>
    </div>
  );
}
