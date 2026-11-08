import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { api } from './services/api.js';
import { connectVitals } from './services/ws.js';
import Dashboard from './pages/Dashboard.jsx';
import Patients from './pages/Patients.jsx';
import PatientForm from './pages/PatientForm.jsx';
import PatientDetails from './pages/PatientDetails.jsx';
import Login from './pages/Login.jsx';

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('vitalstream-token') ? { name: 'Administrador' } : null);
  const [screen, setScreen] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [error, setError] = useState('');

  async function loadDashboard() {
    setDashboard(await api.dashboard());
  }

  useEffect(() => {
    if (!user) return;
    loadDashboard().catch((e) => setError(e.message));
    const socket = connectVitals((message) => {
      if (message.type === 'vital.update' || message.type.startsWith('patient.')) loadDashboard().catch(() => {});
      if (message.type === 'vital.update' && selectedPatient?.patient?.id === message.data.patient_id) {
        api.patient(selectedPatient.patient.id).then(setSelectedPatient).catch(() => {});
      }
    });
    return () => socket.close();
  }, [user]);

  const patients = useMemo(() => dashboard?.patients?.map(({ patient }) => patient) || [], [dashboard]);

  async function openDetails(id) {
    setSelectedPatient(await api.patient(id));
    setScreen('details');
  }

  async function savePatient(form) {
    if (editingPatient) await api.updatePatient(editingPatient.id, form);
    else await api.createPatient(form);
    setEditingPatient(null);
    setScreen('patients');
    await loadDashboard();
  }

  async function deletePatient(id) {
    if (!window.confirm('Excluir este paciente?')) return;
    await api.deletePatient(id);
    setEditingPatient(null);
    setScreen('patients');
    await loadDashboard();
  }

  function navigate(next) {
    setError('');
    setSelectedPatient(null);
    setEditingPatient(null);
    setScreen(next);
  }

  if (!user) return <Login onLoggedIn={setUser} />;

  return (
    <div className="app-shell">
      <Sidebar current={screen === 'details' ? 'patients' : screen} onNavigate={navigate} onLogout={() => { localStorage.removeItem('vitalstream-token'); setUser(null); }} />
      <main className="content">
        {error && <div className="error-banner">{error}</div>}
        {!dashboard ? <div className="loading">Carregando dados...</div> : screen === 'dashboard' ? <Dashboard data={dashboard} onDetails={openDetails} />
          : screen === 'patients' ? <Patients patients={patients} onDetails={openDetails} onEdit={(patient) => { setEditingPatient(patient); setScreen('register'); }} />
          : screen === 'register' ? <PatientForm patient={editingPatient} onSave={savePatient} onDelete={deletePatient} onCancel={() => navigate('patients')} />
          : <PatientDetails data={selectedPatient} onBack={() => navigate('dashboard')} />}
      </main>
    </div>
  );
}
