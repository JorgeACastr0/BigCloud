const mqtt = require('mqtt');

console.log('⏱️  PRUEBA DE TIMING MQTT\n');

let fullMessages = 0;
let lightMessages = 0;

const client = mqtt.connect('mqtt://207.246.69.58:1883', {
  clientId: 'timing_test_' + Date.now(),
  clean: false,  // ← IMPORTANTE: NO limpiar sesión
  reconnectPeriod: 1000
});

client.on('connect', () => {
  console.log('✅ Conectado');
  console.log('📡 Suscribiendo a TomaGris-Internet-plus1pm/events/rpc\n');
  
  client.subscribe('TomaGris-Internet-plus1pm/events/rpc', { qos: 1 }, (err) => {
    if (err) console.log('Error:', err.message);
  });
});

client.on('message', (topic, message) => {
  const msgStr = message.toString();
  const timestamp = new Date().toISOString();
  
  console.log(`\n[${timestamp}] 📨 Mensaje recibido`);
  console.log(`   Longitud: ${msgStr.length} chars`);
  
  // Analizar contenido
  if (msgStr.includes('"switch:0"') && msgStr.includes('"aenergy"')) {
    fullMessages++;
    console.log('   ✅ TIPO: COMPLETO (con switch:0 y aenergy)');
  } else if (msgStr.includes('"cloud"')) {
    lightMessages++;
    console.log('   📝 TIPO: LIGERO (solo cloud status)');
  } else {
    console.log('   ❓ TIPO: DESCONOCIDO');
  }
  
  console.log(`\n📊 ESTADÍSTICAS:`);
  console.log(`   Completos: ${fullMessages}`);
  console.log(`   Ligeros: ${lightMessages}`);
  console.log(`   Total: ${fullMessages + lightMessages}`);
});

// Ejecutar por 2 minutos
setTimeout(() => {
  console.log('\n\n📈 RESUMEN FINAL:');
  console.log(`✅ Mensajes COMPLETOS: ${fullMessages}`);
  console.log(`📝 Mensajes LIGEROS: ${lightMessages}`);
  console.log(`📊 TOTAL: ${fullMessages + lightMessages}`);
  
  if (fullMessages === 0) {
    console.log('\n🚨 ALERTA: No se recibieron mensajes COMPLETOS!');
    console.log('   El Shelly no está publicando datos de energía.');
  }
  
  client.end();
  process.exit(0);
}, 120000);

console.log('⏳ Ejecutando por 2 minutos...');
