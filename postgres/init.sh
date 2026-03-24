#!/bin/sh
# Script de inicio para PostgreSQL + Adminer

# 1. Configurar PHP
ln -sf /usr/bin/php83 /usr/bin/php 2>/dev/null || true

# 2. Iniciar PostgreSQL
echo "Iniciando PostgreSQL..."
exec docker-entrypoint.sh postgres &

# 3. Esperar PostgreSQL
echo "Esperando PostgreSQL..."
sleep 3
until pg_isready -U admin 2>/dev/null; do
  sleep 2
done
echo "PostgreSQL listo"

# 4. Iniciar Adminer
echo "Iniciando Adminer..."
php -S 0.0.0.0:8080 /usr/local/bin/adminer.php > /var/log/adminer.log 2>&1 &
echo "Adminer iniciado en puerto 8080"

# 5. Mantener activo
wait
