import { API_URL } from './api.js';

export function connectVitals(onMessage) {
  const wsUrl = API_URL.replace(/^http/, 'ws') + '/ws';
  const socket = new WebSocket(wsUrl);
  socket.addEventListener('message', (event) => {
    try { onMessage(JSON.parse(event.data)); } catch { /* ignora payload inválido */ }
  });
  return socket;
}
