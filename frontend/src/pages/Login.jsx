import React from 'react';
import { useState } from 'react';
import { api } from '../services/api.js';

export default function Login({ onLoggedIn }) {
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await api.login(form);
      localStorage.setItem('vitalstream-token', result.token);
      onLoggedIn(result.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand login-brand">Vital<span>Stream</span></div>
        <p className="login-subtitle">Monitoramento inteligente de pacientes</p>
        <form onSubmit={submit}>
          <label>Login<input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></label>
          <label>Senha<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary full" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        </form>
        <button className="forgot" type="button">Esqueci minha senha</button>
      </section>
    </main>
  );
}
