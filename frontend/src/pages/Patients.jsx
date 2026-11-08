import React from 'react';
export default function Patients({ patients, onEdit, onDetails }) {
  return (
    <div>
      <header className="page-header"><div><h1>Pacientes</h1><p>Cadastro e acompanhamento dos pacientes em espera.</p></div></header>
      <div className="table-card">
        <table>
          <thead><tr><th>Paciente</th><th>Idade</th><th>CPF</th><th>Pulseira</th><th>Ação</th></tr></thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td><strong>{patient.name}</strong></td><td>{patient.age ?? '—'}</td><td>{patient.cpf || '—'}</td><td>{patient.device_id || '—'}</td>
                <td><button className="text-button" onClick={() => onDetails(patient.id)}>Detalhes</button><button className="text-button" onClick={() => onEdit(patient)}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
