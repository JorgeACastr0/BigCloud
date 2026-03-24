#!/bin/bash
# BigCloudMiami - Backup de archivos de configuración (sin secrets)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

PROJECT_DIR="${PROJECT_DIR:-/opt/bigcloud}"
BACKUP_DIR="${BACKUP_DIR:-/opt/bigcloud-backups}/configs"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/configs_${DATE}.tar.gz"
TEMP_DIR="/tmp/bigcloud-config-backup-$DATE"

mkdir -p "$BACKUP_DIR" "$TEMP_DIR"

echo "[$(date)] Iniciando backup de configuraciones..."

# Copiar docker-compose.yml de cada servicio (sin .env para no exponer secrets)
for dir in bigdata-website postgres n8n-automation evolution-api monitoring mqtt dns netdata; do
    if [ -d "$PROJECT_DIR/$dir" ]; then
        mkdir -p "$TEMP_DIR/$dir"
        find "$PROJECT_DIR/$dir" -name "docker-compose*.yml" -o -name "nginx.conf" -o -name "mosquitto.conf" 2>/dev/null \
            | while read f; do
                # Ofuscar passwords en la copia
                sed 's/password=[^ ]*/password=REDACTED/gi; s/PASSWORD=[^ ]*/PASSWORD=REDACTED/gi' "$f" > "$TEMP_DIR/$dir/$(basename $f)"
            done
    fi
done

tar -czf "$BACKUP_FILE" -C "$TEMP_DIR" . 2>/dev/null
rm -rf "$TEMP_DIR"

SIZE=$(du -sh "$BACKUP_FILE" | cut -f1)
echo "[$(date)] ✅ Backup de configs: $BACKUP_FILE ($SIZE)"
