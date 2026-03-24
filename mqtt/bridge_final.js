const mqtt = require('mqtt');
const axios = require('axios');
const MQTT_BROKER = 'mqtt://207.246.69.58:1883';
const N8N_WEBHOOK_URL = 'https://n8n.bigdata.net.co/webhook/webhook/shelly-mqtt';
console.log('🚀 BRIDGE MQTT → CON FRENO DE 60s');
console.log('📍 Webhook:', N8N_WEBHOOK_URL);
const client = mqtt.connect(MQTT_BROKER, {
  clientId: 'bridge_throttled_' + Date.now(),
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000
});
let contador = 0;
const lastSent = new Map(); // Recordamos cuándo se envió cada tema
const INTERVALO_MINIMO_MS = 60000; // --- 1 MINUTO ENTRE ENVÍOS POR TEMA ---
client.on('connect', () => {
  console.log('✅ CONECTADO al broker MQTT');
  client.subscribe('#', { qos: 1 });
});
client.on('message', async (topic, message) => {
  const ahora = Date.now();
  const msgStr = message.toString();
  // 1. FILTRAR TEMAS RELEVANTES
  const temasRelevantes = ['TomaGris-Internet-plus1pm', 'shellies', 'shelly', 'energy', 'power', 'voltage'];
  const esRelevante = temasRelevantes.some(p => topic.toLowerCase().includes(p.toLowerCase()));
  if (!esRelevante) return;
  // 2. APLICAR FRENO (THROTTLE)
  const ultimaVez = lastSent.get(topic) || 0;
  if (ahora - ultimaVez < INTERVALO_MINIMO_MS) {
    // Si ha pasado menos de un minuto para este tema específico, lo ignoramos
    return;
  }
  // 3. ENVIAR A N8N
  contador++;
  lastSent.set(topic, ahora); // Actualizamos el reloj para este tema
  const hora = new Date().toLocaleTimeString();
  console.log(`[${hora}] #${contador} 📨 ${topic}`);
  try {
    await axios.post(N8N_WEBHOOK_URL, {
      topic: topic,
      message: msgStr,
      timestamp: new Date().toISOString(),
      bridgeCount: contador
    }, { timeout: 3000 });
    console.log(`   ✅ Enviado a n8n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.code || error.message}`);
  }
});
