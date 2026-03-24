#!/bin/bash
# BigCloudMiami - Instalador de cron jobs de backup

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Instalando cron jobs de BigCloudMiami Backup..."
echo "Directorio de scripts: $SCRIPT_DIR"

# Hacer todos los scripts ejecutables
chmod +x "$SCRIPT_DIR"/*.sh

# Crear directorio de logs
mkdir -p /var/log
touch /var/log/bigcloud-backup.log

# Instalar cron jobs
(crontab -l 2>/dev/null | grep -v "BigCloudMiami"; cat <<CRONEOF
# ========== BigCloudMiami Backups ==========
# PostgreSQL - todos los días a las 2:00am
0 2 * * * $SCRIPT_DIR/backup_postgres.sh >> /var/log/bigcloud-backup.log 2>&1

# n8n - todos los días a las 2:30am
30 2 * * * $SCRIPT_DIR/backup_n8n.sh >> /var/log/bigcloud-backup.log 2>&1

# Configuraciones - domingos a las 3:00am
0 3 * * 0 $SCRIPT_DIR/backup_configs.sh >> /var/log/bigcloud-backup.log 2>&1

# Snapshots Proxmox - cada día a las 4:00am
0 4 * * * $SCRIPT_DIR/backup_proxmox_snapshots.sh >> /var/log/bigcloud-backup.log 2>&1
# ========================================
CRONEOF
) | crontab -

echo ""
echo "✅ Cron jobs instalados:"
crontab -l | grep -A1 "BigCloud"
echo ""
echo "Logs en: /var/log/bigcloud-backup.log"
echo "Para verificar: tail -f /var/log/bigcloud-backup.log"
