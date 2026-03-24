#!/bin/bash
echo "=== VERIFICACIÓN DESDE HOST ==="
echo ""

echo "1. Contenedor PostgreSQL:"
docker ps | grep postgres-shared && echo "✅ Contenedor activo" || echo "❌ Contenedor no existe"

echo ""
echo "2. PostgreSQL funcionando:"
docker exec postgres-shared pg_isready -U admin 2>/dev/null && echo "✅ PostgreSQL acepta conexiones" || echo "❌ PostgreSQL no responde"

echo ""
echo "3. Adminer dentro del contenedor:"
if docker exec postgres-shared ps aux 2>/dev/null | grep -q "[p]hp.*8080"; then
    echo "✅ Adminer proceso activo"
else
    echo "❌ Adminer no corriendo"
    echo "   Iniciando Adminer..."
    docker exec -d postgres-shared sh -c "cd /usr/local/bin && ./start-adminer.sh"
    sleep 2
fi

echo ""
echo "4. Puerto interno 8080:"
if docker exec postgres-shared netstat -tlnp 2>/dev/null | grep -q ":8080"; then
    echo "✅ Puerto 8080 escuchando"
else
    echo "❌ Puerto 8080 no escuchando"
fi

echo ""
echo "5. Prueba interna Adminer:"
docker exec postgres-shared timeout 3 curl -s http://localhost:8080 2>/dev/null | grep -i "login" | head -2 && echo "✅ Adminer responde" || echo "❌ Adminer no responde"

echo ""
echo "6. Traefik configuración:"
docker inspect postgres-shared --format='{{range $k,$v := .Config.Labels}}{{$k}}={{$v}}{{"\n"}}{{end}}' 2>/dev/null | grep traefik

echo ""
echo "7. Prueba web externa:"
echo "   Desde navegador: https://sql.bigdata.net.co"
echo "   Desde terminal: curl -k -I https://sql.bigdata.net.co"

echo ""
echo "=== RESUMEN ==="
echo "Si todo está verde ✅ pero no puedes acceder vía web:"
echo "1. Verifica que las labels de Traefik están en docker-compose.yml"
echo "2. Reinicia: docker compose down && docker compose up -d"
echo "3. Inicia Adminer: docker exec -d postgres-shared /usr/local/bin/start-adminer.sh"
