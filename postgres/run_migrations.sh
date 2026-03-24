#!/bin/bash
# Script para ejecutar migraciones PostgreSQL en orden
# Uso: ./run_migrations.sh
# Requiere que el contenedor postgres-shared esté corriendo

set -e

# Cargar variables de entorno si existe .env en el directorio padre
if [ -f "../bigdata-website/backend/.env" ]; then
    export $(grep -v '^#' ../bigdata-website/backend/.env | xargs)
fi

PGHOST="${POSTGRES_HOST:-localhost}"
PGPORT="${POSTGRES_PORT:-5432}"
PGUSER="${POSTGRES_USER:-admin}"
PGDB="${POSTGRES_DB:-bigdata_isp_v2}"

echo "=========================================="
echo "Ejecutando migraciones BigCloudMiami..."
echo "Host: $PGHOST | DB: $PGDB | User: $PGUSER"
echo "=========================================="

run_migration() {
    local file=$1
    echo ""
    echo "▶ Ejecutando: $file"
    PGPASSWORD="${POSTGRES_PASSWORD}" psql \
        -h "$PGHOST" \
        -p "$PGPORT" \
        -U "$PGUSER" \
        -d "$PGDB" \
        -f "migrations/$file" \
        && echo "  ✅ $file completado" \
        || { echo "  ❌ Error en $file"; exit 1; }
}

run_migration "001_initial_schema.sql"
run_migration "002_indexes_and_constraints.sql"
run_migration "003_correct_plans.sql"
run_migration "004_pagos.sql"

echo ""
echo "=========================================="
echo "✅ Todas las migraciones completadas!"
echo "=========================================="
