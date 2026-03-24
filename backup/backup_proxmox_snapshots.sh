#!/bin/bash
# BigCloudMiami - Snapshots automáticos de VMs activas en Proxmox

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
[ -f "$SCRIPT_DIR/.env" ] && source "$SCRIPT_DIR/.env"

PROXMOX_HOST="${PROXMOX_HOST:-201.184.49.203}"
PROXMOX_PORT="${PROXMOX_PORT:-8006}"
PROXMOX_USER="${PROXMOX_USER:-api-user@pve}"
PROXMOX_TOKEN_ID="${PROXMOX_TOKEN_ID}"
PROXMOX_TOKEN_SECRET="${PROXMOX_TOKEN_SECRET}"
PROXMOX_NODE="${PROXMOX_NODE:-servidor1}"
N8N_WEBHOOK="${N8N_WEBHOOK_BACKUP:-}"

SNAP_DATE=$(date +%Y%m%d)
SNAP_NAME="auto_${SNAP_DATE}"
AUTH_HEADER="Authorization: PVEAPIToken=${PROXMOX_USER}!${PROXMOX_TOKEN_ID}=${PROXMOX_TOKEN_SECRET}"

echo "[$(date)] Iniciando snapshots automáticos en Proxmox..."

# Obtener lista de VMs/CTs corriendo
VMAS=$(curl -s -k -H "$AUTH_HEADER" \
    "https://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json/nodes/${PROXMOX_NODE}/qemu" \
    2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); [print(v['vmid']) for v in data.get('data',[]) if v.get('status')=='running']" 2>/dev/null || echo "")

LXCS=$(curl -s -k -H "$AUTH_HEADER" \
    "https://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json/nodes/${PROXMOX_NODE}/lxc" \
    2>/dev/null | python3 -c "import sys,json; data=json.load(sys.stdin); [print(v['vmid']) for v in data.get('data',[]) if v.get('status')=='running']" 2>/dev/null || echo "")

SUCCESS=0
ERRORS=0

# Snapshots de VMs KVM
for VMID in $VMAS; do
    echo "[$(date)] Snapshot VM (KVM) $VMID..."
    RESULT=$(curl -s -k -X POST -H "$AUTH_HEADER" -H "Content-Type: application/json" \
        -d "{\"snapname\":\"$SNAP_NAME\",\"description\":\"Auto $(date +%Y-%m-%d)\"}" \
        "https://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json/nodes/${PROXMOX_NODE}/qemu/${VMID}/snapshot" 2>/dev/null)

    if echo "$RESULT" | grep -q '"data"'; then
        echo "  ✅ VM $VMID snapshot OK"
        SUCCESS=$((SUCCESS+1))
    else
        echo "  ⚠️ VM $VMID: $(echo $RESULT | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("errors","unknown"))' 2>/dev/null)"
        ERRORS=$((ERRORS+1))
    fi
done

# Snapshots de LXC
for VMID in $LXCS; do
    echo "[$(date)] Snapshot LXC $VMID..."
    RESULT=$(curl -s -k -X POST -H "$AUTH_HEADER" -H "Content-Type: application/json" \
        -d "{\"snapname\":\"$SNAP_NAME\",\"description\":\"Auto $(date +%Y-%m-%d)\"}" \
        "https://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json/nodes/${PROXMOX_NODE}/lxc/${VMID}/snapshot" 2>/dev/null)

    if echo "$RESULT" | grep -q '"data"'; then
        echo "  ✅ LXC $VMID snapshot OK"
        SUCCESS=$((SUCCESS+1))
    else
        echo "  ⚠️ LXC $VMID snapshot error"
        ERRORS=$((ERRORS+1))
    fi
done

echo "[$(date)] Snapshots completados: $SUCCESS OK, $ERRORS errores"

[ -n "$N8N_WEBHOOK" ] && curl -s -X POST "$N8N_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{\"status\":\"$([ $ERRORS -eq 0 ] && echo success || echo warning)\",\"type\":\"proxmox_snapshots\",\"success\":$SUCCESS,\"errors\":$ERRORS,\"timestamp\":\"$(date -Iseconds)\"}" || true
