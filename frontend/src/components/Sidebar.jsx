import React from 'react';

export default function Sidebar({ current, onNavigate, onLogout }) {
  const items = [
    ['dashboard', 'Dashboard', '⌂'],
    ['patients', 'Pacientes', '◉'],
    ['register', 'Cadastro de Paciente', '+']
  ];

  return (
    <aside className="sidebar">
      <div className="brand">Vital<span>Stream</span></div>
      <nav>
        {items.map(([id, label, icon]) => (
          <button key={id} className={current === id ? 'nav-item active' : 'nav-item'} onClick={() => onNavigate(id)}>
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
      <button className="logout" onClick={onLogout}>Sair</button>
    </aside>
  );
}
