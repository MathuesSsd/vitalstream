import React, { useEffect, useState } from 'react';

const empty = { name: '', cpf: '', phone: '', email: '', emergencyPhone: '', age: '', deviceId: '', active: true };

export default function PatientForm({ patient, onSave, onDelete, onCancel }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (patient) {
      setForm({ name: patient.name || '', cpf: patient.cpf || '', phone: patient.phone || '', email: patient.email || '', emergencyPhone: patient.emergency_phone || '', age: patient.age ?? '', deviceId: patient.device_id || '', active: patient.active ?? true });
    } else setForm(empty);
  }, [patient]);

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try { await onSave({ ...form, age: form.age === '' ? null : Number(form.age) }); }
    finally { setSaving(false); }
  }

  return (
    <div>
      <header className="page-header"><div><h1>Cadastro do Paciente</h1><p>{patient ? 'Atualize os dados do paciente.' : 'Cadastre um paciente para iniciar o monitoramento.'}</p></div></header>
      <form className="form-card" onSubmit={submit}>
        <div className="form-avatar">+</div>
        <div className="form-grid">
          <label>Nome<input value={form.name} onChange={(e) => update('name', e.target.value)} required /></label>
          <label>CPF<input value={form.cpf} onChange={(e) => update('cpf', e.target.value)} /></label>
          <label>Telefone<input value={form.phone} onChange={(e) => update('phone', e.target.value)} /></label>
          <label>Email<input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></label>
          <label>Telefone de emergência<input value={form.emergencyPhone} onChange={(e) => update('emergencyPhone', e.target.value)} /></label>
          <label>Idade<input type="number" min="0" value={form.age} onChange={(e) => update('age', e.target.value)} /></label>
          <label>Pulseira / Device ID<input placeholder="VS-0001" value={form.deviceId} onChange={(e) => update('deviceId', e.target.value)} /></label>
          <label className="check-row"><input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} /> Monitoramento ativo</label>
        </div>
        <div className="form-actions">
          <button type="button" className="secondary" onClick={onCancel}>Cancelar</button>
          {patient && <button type="button" className="danger-outline" onClick={() => onDelete(patient.id)}>Excluir</button>}
          <button className="primary" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </div>
  );
}
