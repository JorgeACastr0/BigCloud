#!/bin/sh
echo "🔍 Probando IPs desde perspectiva n8n..."
echo ""

IPS="172.17.0.1 172.18.0.1 host.docker.internal localhost $(hostname -I | awk '{print $1}')"

for IP in $IPS; do
  echo "Probando: $IP"
  docker run --rm --network host eclipse-mosquitto:2.0.18 \
    sh -c "timeout 3 mosquitto_sub -h '$IP' -t 'TomaGris-Internet-plus1pm/status/switch:0' -W 1 -C 1 -v 2>&1" | \
    grep -v "failed\|Error\|timeout" || echo "  ❌ No conecta"
  echo "---"
done
