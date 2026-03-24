#!/bin/bash
# Script CORREGIDO para descubrir endpoints de Evolution API
# Genera comandos Docker-Curl exactos

API_HOST="evolution-api:8080"
API_KEY="5A6C4480-262F-4C20-BBC7-D8CBEC0B5C02"
INSTANCE="bigdata-isp"
JID="211321014509793@lid"

echo "=== DESCUBRIENDO ENDPOINTS DE EVOLUTION API ==="
echo "Red: n8n-automation_default"
echo "Host: $API_HOST"
echo "=============================================="

# Lista de endpoints a probar - PRIORIZADOS
endpoints=(
    # 1. Endpoints de INSTANCE (sabemos que algunos funcionan)
    "GET /instance/fetchInstances"
    "GET /instance/connectionState?instance=$INSTANCE"
    
    # 2. Endpoints de CONTACT (tu objetivo principal)
    "GET /contact"
    "GET /contact/find?instance=$INSTANCE"
    "POST /contact/find {\"instance\": \"$INSTANCE\"}"
    "POST /contact/get {\"instance\": \"$INSTANCE\", \"contactId\": \"$JID\"}"
    "POST /contact/findContacts {\"instance\": \"$INSTANCE\"}"
    
    # 3. Endpoints de CHAT
    "GET /chat"
    "GET /chat/find?instance=$INSTANCE&jid=$JID"
    "POST /chat/find {\"instance\": \"$INSTANCE\", \"jid\": \"$JID\"}"
    
    # 4. Endpoints de MESSAGE (para testear)
    "POST /message/sendText {\"instance\": \"$INSTANCE\", \"number\": \"$JID\", \"text\": \".\"}"
    
    # 5. Endpoints de PROFILE
    "GET /profile?instance=$INSTANCE"
    
    # 6. Endpoints de GROUP
    "GET /group"
    "POST /group/find {\"instance\": \"$INSTANCE\"}"
)

for endpoint in "${endpoints[@]}"; do
    # Separar método, ruta y cuerpo
    method=$(echo $endpoint | awk '{print $1}')
    path=$(echo $endpoint | awk '{print $2}')
    body=$(echo $endpoint | awk '{$1=$2=""; print substr($0,3)}')
    
    echo ""
    echo "🔍 Probando: $method $path"
    
    # Construir el comando Docker-Curl EXACTO
    cmd="docker run --rm --network n8n-automation_default curlimages/curl -s"
    
    # Agregar método
    cmd="$cmd -X $method"
    
    # Agregar cuerpo si existe
    if [ -n "$body" ] && [ "$body" != "null" ]; then
        cmd="$cmd -H 'Content-Type: application/json' -d '$body'"
    fi
    
    # Agregar API key y URL
    cmd="$cmd -H 'apikey: $API_KEY' 'http://$API_HOST$path'"
    
    # Mostrar comando (opcional, para debug)
    # echo "Comando: $cmd"
    
    # Ejecutar y capturar resultado
    result=$(eval $cmd 2>/dev/null)
    
    # Analizar respuesta
    if echo "$result" | grep -q '"status":200'; then
        echo "   ✅ 200 OK - ¡ENDPOINT FUNCIONAL!"
        echo "   Respuesta: $(echo $result | head -c 100)..."
    elif echo "$result" | grep -q '"status":404'; then
        echo "   ❌ 404 Not Found"
    elif echo "$result" | grep -q '"status":'; then
        status=$(echo $result | grep -o '"status":[0-9]*' | cut -d: -f2)
        echo "   ⚠️  HTTP $status"
        if [ "$status" = "400" ] || [ "$status" = "500" ]; then
            echo "   Posible error en parámetros, pero endpoint EXISTE"
        fi
    elif [ -z "$result" ]; then
        echo "   ⚠️  Respuesta vacía o timeout"
    else
        echo "   🔍 Respuesta inesperada: $(echo $result | head -c 80)..."
    fi
    
    # Pequeña pausa
    sleep 0.3
done

echo ""
echo "=============================================="
echo "📊 RESUMEN: Si ves algún '200 OK' o '400/500'"
echo "   ¡ese endpoint EXISTE y merece más investigación!"
echo "=============================================="
