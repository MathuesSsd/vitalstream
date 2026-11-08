import React from 'react';
import PatientCard from '../components/PatientCard.jsx';

export default function Dashboard({ data, onDetails }) {
  const { summary, patients } = data;
  return (
    <div>
      <header className="page-header"><div><h1>Dashboard</h1><p>Visão geral dos pacientes monitorados em tempo real.</p></div></header>
      <section className="metrics">
        <div className="metric-card green"><span>Pulseiras ativas</span><strong>{summary.activeWristbands}</strong></div>
        <div className="metric-card amber"><span>Pacientes monitorados</span><strong>{summary.monitored}</strong></div>
        <div className="metric-card red"><span>Alertas ativos</span><strong>{summary.alerts}</strong></div>
      </section>
      <section className="overview-row">
        <div className="status-chart-card">
          <div className="section-title"><h2>Estado dos pacientes</h2><span className="live-dot">Ao vivo</span></div>
          <div className="donut-wrap">
            <div className="donut" style={{ '--normal': `${summary.normal}`, '--attention': `${summary.atencao}`, '--danger': `${summary.perigo}` }}>
              <div className="donut-center"><strong>{summary.monitored}</strong><span>monitorados</span></div>
            </div>
            <div className="legend">
              <div><i className="dot normal"></i><span>Normal</span><strong>{summary.normal}</strong></div>
              <div><i className="dot atencao"></i><span>Atenção</span><strong>{summary.atencao}</strong></div>
              <div><i className="dot perigo"></i><span>Perigo</span><strong>{summary.perigo}</strong></div>
            </div>
          </div>
        </div>
        <div className="priority-card">
          <div className="section-title"><h2>Prioridade</h2></div>
          <div className="priority-list">
            {patients.filter(({ latest }) => latest?.status === 'perigo' || latest?.status === 'atencao').slice(0, 5).map((item) => (
              <button key={item.patient.id} className="priority-row" onClick={() => onDetails(item.patient.id)}>
                <span>{item.patient.name}</span><strong>{item.latest?.heart_rate ?? '--'} bpm</strong><em className={item.latest.status}>{item.latest.status === 'perigo' ? 'Perigo' : 'Atenção'}</em>
              </button>
            ))}
            {!patients.some(({ latest }) => latest?.status === 'perigo' || latest?.status === 'atencao') && <div className="empty">Nenhum alerta ativo.</div>}
          </div>
        </div>
      </section>
      <section>
        <div className="section-title"><h2>Pacientes monitorados</h2><span>{patients.length} cadastrados</span></div>
        <div className="patient-grid">{patients.map((item) => <PatientCard key={item.patient.id} item={item} onDetails={onDetails} />)}</div>
      </section>
    </div>
  );
}
