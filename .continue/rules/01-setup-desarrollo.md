---
name: Contexto General - BigCloud
alwaysApply: true
description: Vision del proyecto, arquitectura, hardware, planes VPS y roadmap.
---

# Proyecto BigCloud - Cloud Local Colombia

## Vision General
Proveedor de infraestructura cloud local en Colombia combinando: VPS (CT y KVM), Hosting web, Venta de dominios, DNS gestionado, Reverse proxy con SSL automatico, Inferencia de IA integrada, Infraestructura propia (ASN, BGP, ISP).

## Infraestructura Actual
- CPU: 2x Xeon E5-2673 v4 (40 cores / 80 threads)
- RAM: 128 GB DDR4
- GPU: RTX 3060 12GB VRAM
- Almacenamiento: NVMe 1TB + HDD 1TB
- Red: Quad Intel 1Gb (LACP), ASN propio, bloque /23, BGP activo
- Sistema: Proxmox VE

## Planes VPS
- CT (LXC): XS $2.5, S $4, M $7, L $12, XL $20
- KVM: XS $6, S $10, M $18, L $35, XL $65

## Estado Actual
MVP avanzado listo para produccion inicial.
Archivo 2: 01-setup-desarrollo.md
Nuevo archivo: 01-setup-desarrollo.md

Copia SOLO ESTO:


---
name: Setup Local - Desarrollo
globs: ["**/SETUP-LOCAL.md", "**/backend/.env", "**/postgres/migrations/*.sql"]
alwaysApply: false
description: Instrucciones de configuracion local y comandos de desarrollo.
---

# Setup Local - BigCloud

## Levantar PostgreSQL
docker run -d \
  --name postgres-local \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD="BigData_Postgres_2025_Secure!" \
  -e POSTGRES_DB=bigdata_isp_v2 \
  -p 5432:5432 \
  postgres:15
Migraciones (orden)
001_initial_schema.sql

002_indexes_and_constraints.sql

003_correct_plans.sql

004_pagos.sql

Usuario Admin
bash
cd bigdata-website/backend
npm install
node fix-admin.js
Credenciales: admin@test.com / 123456

Iniciar Servicios
Backend: cd bigdata-website/backend && npm start (puerto 3006)

Frontend: cd bigdata-website/src && npx http-server -p 8080 --proxy http://localhost:3006

Login: http://localhost:8080/panel/

Dashboard: http://localhost:8080/dashboard/

text

---

#### Archivo 3: `02-entorno-ollama.md`

1. Nuevo archivo: `02-entorno-ollama.md`
2. Copia **SOLO ESTO**:

---
name: Entorno Ollama - Servidor IA
alwaysApply: true
description: Configuracion del servidor de IA y modelos disponibles.
---

# Entorno de IA - BigCloud

## Servidor Ollama
- URL: http://10.15.15.10:11434
- CPU: 40 hilos
- RAM: 80+ GB
- GPU: RTX 3060 12GB VRAM

## Modelos
| Modelo | Uso |
|--------|-----|
| qwen2.5-coder:14b | Principal |
| deepseek-coder-v2:16b | Alternativa |
| nomic-embed-text:latest | Embeddings |

## Preferencias
- Modelo principal: Qwen 2.5 Coder 14B
- Respuestas en español (es-CO)
- Incluir comandos de terminal cuando sean relevantes