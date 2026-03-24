#!/bin/bash
# BigCloudMiami - Backup de datos de n8n

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

BACKUP_DIR="${BACKUP_DIR:-/opt/bigcloud-backups}/n8n"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-7}"
DATE=$(date +%Y%m%d_%H%M%S)
N8N_DATA_DIR="${N8N_DATA_DIR:-/opt/bigcloud/n8n-automation/n8n-data}"
BACKUP_FILE="$BACKUP_DIR/n8n_${DATE}.tar.gz"
N8N_WEBHOOK="${N8N_WEBHOOK_BACKUP:-}"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup de n8n..."

if [ ! -d "$N8N_DATA_DIR" ]; then
    echo "[$(date)] ⚠️ Directorio n8n no encontrado: $N8N_DATA_DIR"
    exit 1
fi

tar -czf "$BACKUP_FILE" -C "$(dirname $N8N_DATA_DIR)" "$(basename $N8N_DATA_DIR)" 2>/dev/null

if [ $? -eq 0 ]; then
    SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] ✅ Backup n8n exitoso: $BACKUP_FILE ($SIZE)"
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    [ -n "$N8N_WEBHOOK" ] && curl -s -X POST "$N8N_WEBHOOK" \
        -H "Content-Type: application/json" \
        -d "{\"status\":\"success\",\"type\":\"n8n\",\"size\":\"$SIZE\",\"timestamp\":\"$(date -Iseconds)\"}" || true
else
    echo "[$(date)] ❌ ERROR backup n8n"
    exit 1
fi
