#!/bin/bash
# BigCloudMiami - Backup automatizado de PostgreSQL
# Hace pg_dumpall del contenedor postgres-shared

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

BACKUP_DIR="${BACKUP_DIR:-/opt/bigcloud-backups/postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/postgres_${DATE}.sql.gz"
N8N_WEBHOOK="${N8N_WEBHOOK_BACKUP:-}"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup PostgreSQL..."

docker exec postgres-shared pg_dumpall -U "${POSTGRES_USER:-admin}" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] ✅ Backup exitoso: $BACKUP_FILE ($SIZE)"
    find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    echo "[$(date)] Backups mayores a ${RETENTION_DAYS} días eliminados"
    [ -n "$N8N_WEBHOOK" ] && curl -s -X POST "$N8N_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"success\",\"type\":\"postgres\",\"file\":\"$(basename $BACKUP_FILE)\",\"size\":\"$SIZE\",\"timestamp\":\"$(date -Iseconds)\"}" || true
else
    echo "[$(date)] ❌ ERROR: Backup fallido"
    [ -n "$N8N_WEBHOOK" ] && curl -s -X POST "$N8N_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"error\",\"type\":\"postgres\",\"message\":\"pg_dump failed\",\"timestamp\":\"$(date -Iseconds)\"}" || true
    exit 1
fi
