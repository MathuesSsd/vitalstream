# VitalStream — UPA Patient Monitoring

Protótipo acadêmico de monitoramento de pacientes em espera, inspirado nas telas fornecidas.

## Arquitetura

```text
Wearable/ESP32
    │ MQTT
    ▼
Mosquitto Broker
    │
    ▼
Node.js + Express + MQTT subscriber
    │                    │
    │ WebSocket          │ PostgreSQL
    ▼                    ├── vitalstream_patients (CRUD)
React Dashboard         └── vitalstream_vitals (sinais vitais)
```

### Tecnologias

- Wearables IoT / ESP32 (o firmware não faz parte deste pacote)
- MQTT (Mosquitto)
- WebSockets (biblioteca `ws`)
- Backend JavaScript / Node.js
- React + Vite
- PostgreSQL em **dois bancos separados**

## Estrutura

- `backend/`: API REST + subscriber MQTT + WebSocket
- `frontend/`: dashboard React
- `simulator/`: simulador de pulseiras publicando dados MQTT
- `mosquitto/`: configuração do broker
- `docker-compose.yml`: sobe PostgreSQL e Mosquitto

## 1. Infraestrutura

Pré-requisito: Docker Desktop.

```bash
docker compose up -d
```

Isso cria:

- PostgreSQL na porta `5432`
- Mosquitto MQTT na porta `1883`

Os dois bancos são criados automaticamente:

- `vitalstream_patients`
- `vitalstream_vitals`

## 2. Backend

```bash
cd backend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # Linux/macOS
npm run dev
```

API: `http://localhost:3001`
WebSocket: `ws://localhost:3001/ws`

## 3. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite, normalmente `http://localhost:5173`.

Login de demonstração:

- usuário: `admin`
- senha: `admin123`

## 4. Simular pulseiras

Em outro terminal:

```bash
cd simulator
npm install
npm start
```

O simulador usa MQTT e cria/publica sinais para os pacientes de demonstração. Também é possível publicar manualmente em um tópico no formato:

```text
vitalstream/devices/VS-0001/vitals
```

Payload:

```json
{
  "patientId": "ID-DO-PACIENTE",
  "deviceId": "VS-0001",
  "heartRate": 88,
  "spo2": 98,
  "temperature": 36.7,
  "timestamp": "2026-08-28T03:00:00.000Z"
}
```

## Fluxo em tempo real

1. O wearable publica no MQTT.
2. O backend recebe a mensagem.
3. O backend valida o payload.
4. O backend grava o sinal no banco `vitalstream_vitals`.
5. O backend calcula um status **DEMONSTRATIVO** (Normal / Atenção / Perigo).
6. O backend transmite o evento aos navegadores conectados por WebSocket.
7. O React atualiza o card e o gráfico sem recarregar a página.
