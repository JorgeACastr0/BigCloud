#!/bin/bash
echo "🔍 DIAGNÓSTICO SEGURO - Solo lectura"
echo "No se modificará ningún estado"
echo ""

# 1. Ver estado actual
echo "1. Obteniendo estado actual..."
docker exec mosquitto mosquitto_pub \
  -t "TomaGris-Internet-plus1pm/command" \
  -m '{"id":1,"src":"user","method":"Shelly.GetStatus"}' 2>/dev/null

# 2. Escuchar 10 segundos
echo "2. Escuchando respuesta (10 segundos)..."
timeout 10s docker exec mosquitto mosquitto_sub \
  -t "TomaGris-Internet-plus1pm/events/rpc" -v | \
  grep -A5 -B5 "apower\|voltage\|current"

# 3. Ver configuración MQTT
echo ""
echo "3. Configuración MQTT actual:"
docker exec mosquitto mosquitto_pub \
  -t "TomaGris-Internet-plus1pm/command" \
  -m '{"id":1,"src":"user","method":"Shelly.GetConfig"}' 2>/dev/null

sleep 2
timeout 5s docker exec mosquitto mosquitto_sub \
  -t "TomaGris-Internet-plus1pm/events/rpc" -v | \
  grep -i "mqtt"
