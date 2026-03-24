const mqtt = require('mqtt');
const axios = require('axios');

const MQTT_BROKER = 'mqtt://207.246.69.58:1883';
const N8N_WEBHOOK_URL = 'https://n8n.bigdata.net.co/webhook/webhook/shelly-mqtt';

console.log('🚀 BRIDGE MQTT → SUSCRIBIENDO A # (TODOS)');
console.log('📍 Webhook:', N8N_WEBHOOK_URL);

const client = mqtt.connect(MQTT_BROKER, {
  clientId: 'bridge_all_topics_' + Date.now(),
  clean: false,
  keepalive: 60,
  reconnectPeriod: 5000
});

client.on('connect', () => {
  console.log('✅ CONECTADO al broker MQTT');
  
  // SUSCRIBIRSE a TODOS los temas
  client.subscribe('#', { qos: 1 }, (err) => {
    if (err) {
      console.log('❌ Error suscribiendo:', err.message);
      process.exit(1);
    }
    console.log('✅ SUSCRITO a # (TODOS los temas del broker)');
    console.log('📡 Enviando TODO a n8n...\n');
  });
});

let contador = 0;

client.on('message', async (topic, message) => {
  contador++;
  const hora = new Date().toLocaleTimeString();
  const msgStr = message.toString();
  
  // FILTRAR: Solo enviar temas relevantes (opcional, puedes quitar esto)
  const temasRelevantes = [
    'TomaGris-Internet-plus1pm',
    'shellies',
    'shelly',
    'energy',
    'power',
    'voltage'
  ];
  
  const esRelevante = temasRelevantes.some(palabra => 
    topic.toLowerCase().includes(palabra.toLowerCase())
  );
  
  if (!esRelevante) {
    console.log(`[${hora}] #${contador} ⏭️  ${topic} (no relevante)`);
    return;
  }
  
  console.log(`[${hora}] #${contador} 📨 ${topic}`);
  console.log(`   📏 Longitud: ${msgStr.length} chars`);
  
  if (topic.includes('/status/switch:0')) {
    console.log('   🔌 CONTIENE DATOS DE ENERGÍA/VOLTAJE');
  }
  
  try {
    await axios.post(N8N_WEBHOOK_URL, {
      topic: topic,
      message: msgStr,
      timestamp: new Date().toISOString(),
      bridgeCount: contador
    }, {
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`   ✅ Enviado a n8n\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.code || error.message}\n`);
  }
});

process.on('SIGINT', () => {
  console.log(`\n📊 Total mensajes procesados: ${contador}`);
  console.log('🛑 Bridge detenido');
  client.end();
  process.exit(0);
});
