#!/bin/bash
cd ~/mqtt
echo "🚀 Iniciando MQTT Broker para Shelly..."
docker compose up -d mosquitto

echo ""
echo "✅ MQTT Broker iniciado en:"
echo "   mqtt://localhost:1883"
echo "   ws://localhost:9001"
echo ""
echo "📡 Para conectar Shelly:"
echo "   Server: IP_DE_ESTE_SERVIDOR:1883"
echo "   Topic:  shellies/%device_id%/"
echo ""
echo "🔧 Comandos útiles:"
echo "   Ver logs:    docker compose logs -f mosquitto"
echo "   Detener:     docker compose down"
echo "   Cliente test: docker exec -it mqtt-tester sh"
