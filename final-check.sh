#!/bin/bash
echo "=== VERIFICACIÓN FINAL ==="
echo ""
echo "1. PostgreSQL directo (puerto 5432):"
timeout 2 nc -z sql.bigdata.net.co 5432 && echo "✅ Puerto 5432 accesible" || echo "❌ Puerto 5432 no accesible"

echo ""
echo "2. Adminer dentro del contenedor:"
docker exec postgres-shared ps aux | grep php && echo "✅ Adminer corriendo" || echo "❌ Adminer no corriendo"

echo ""
echo "3. Traefik configuración:"
docker logs traefik --tail 5 2>&1 | grep -i "sql.bigdata" && echo "✅ Traefik detecta sql.bigdata.net.co" || echo "⚠️  Traefik no muestra sql.bigdata"

echo ""
echo "4. Prueba web Adminer:"
echo "   Desde navegador: https://sql.bigdata.net.co"
echo ""
echo "5. Credenciales:"
echo "   Sistema: PostgreSQL"
echo "   Servidor: localhost (DENTRO del contenedor)"
echo "   Usuario: admin"
echo "   Contraseña: BigData_Postgres_2025_Secure!"
echo "   Base de datos: postgres"
