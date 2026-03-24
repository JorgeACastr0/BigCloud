# Setup Local - BigCloud

## Pre-requisitos

- [Node.js 18+](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/JorgeACastr0/BigCloud.git
cd BigCloud
```

---

## 2. Crear el archivo .env

El `.env` **no está en git** por seguridad. Pídele a Jorge el archivo o créalo manualmente en `bigdata-website/backend/.env` con este contenido:

```env
NODE_ENV=development

JWT_SECRET=BigData_JWT_Secret_2025_XkP9!mN#qR
JWT_EXPIRES=1d

POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=bigdata_isp_v2
POSTGRES_USER=admin
POSTGRES_PASSWORD=BigData_Postgres_2025_Secure!

PROXMOX_HOST=201.184.49.203
PROXMOX_PORT=8006
PROXMOX_NODE=servidor1
PROXMOX_USER=api-user@pve
PROXMOX_TOKEN_ID=mi-token
PROXMOX_TOKEN_SECRET=45c74305-e052-4b6d-a842-4a40b3571441
PROXMOX_REJECT_UNAUTHORIZED=false

WOMPI_PUBLIC_KEY=pub_test_REEMPLAZAR
WOMPI_PRIVATE_KEY=prv_test_REEMPLAZAR
WOMPI_EVENTS_SECRET=REEMPLAZAR
WOMPI_INTEGRITY_SECRET=REEMPLAZAR

USD_TO_COP_RATE=4200

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_GENERAL=100
RATE_LIMIT_MAX_LOGIN=10
```

> **IMPORTANTE:** Los valores de Proxmox y Wompi reales pídeselos a Jorge por privado. Nunca los compartas en el chat del repo.

---

## 3. Levantar PostgreSQL local

```bash
docker run -d \
  --name postgres-local \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD="BigData_Postgres_2025_Secure!" \
  -e POSTGRES_DB=bigdata_isp_v2 \
  -p 5432:5432 \
  postgres:15
```

Espera 5 segundos y verifica:
```bash
docker exec -it postgres-local psql -U admin -d bigdata_isp_v2 -c "\dt"
```

---

## 4. Correr migraciones

### Linux/Mac:
```bash
for f in postgres/migrations/*.sql; do
  docker exec -i postgres-local psql -U admin -d bigdata_isp_v2 < "$f"
done
```

### Windows (PowerShell):
```powershell
Get-Content "postgres\migrations\001_initial_schema.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\002_indexes_and_constraints.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\003_correct_plans.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\004_pagos.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
```

---

## 5. Crear usuario de prueba

```bash
cd bigdata-website/backend
npm install
node fix-admin.js
```

Esto crea el usuario `admin@test.com` con contraseña `123456`.

> Si `fix-admin.js` no existe, pídele a Jorge que lo comparta o usa este comando:
> ```bash
> node -e "
> require('dotenv').config();
> const bcrypt = require('bcryptjs');
> const { Pool } = require('pg');
> const pool = new Pool({ host: process.env.POSTGRES_HOST, port: 5432, database: process.env.POSTGRES_DB, user: process.env.POSTGRES_USER, password: process.env.POSTGRES_PASSWORD });
> bcrypt.hash('123456', 10).then(h => pool.query(\"INSERT INTO clientes_cloud (nombre, email, password_hash, rol, estado, estado_verificacion) VALUES ('Admin', 'admin@test.com', '\"+h+\"', 'admin', 'ACTIVO', 'VERIFICADO')\").then(() => { console.log('Usuario creado'); pool.end(); }));
> "
> ```

---

## 6. Iniciar el backend

```bash
cd bigdata-website/backend
npm start
```

Debe mostrar:
```
✅ Backend API v5.0 (Hardened) running on port 3006
```

---

## 7. Servir el frontend

En otra terminal:

```bash
cd bigdata-website/src
npx http-server -p 8080 --proxy http://localhost:3006
```

---

## 8. Abrir en el browser

| URL | Descripción |
|-----|-------------|
| http://localhost:8080/panel/ | Login |
| http://localhost:8080/dashboard/ | Dashboard |

**Credenciales de prueba:** `admin@test.com` / `123456`

---

## Flujo de trabajo diario

```bash
# Antes de empezar
git pull origin main

# Al terminar algo
git add .
git commit -m "feat: descripción"
git push origin main
```

## Estructura del proyecto

```
BigCloud/
├── bigdata-website/
│   ├── backend/          # API Node.js (puerto 3006)
│   │   ├── routes/       # Endpoints: cloud, payment, admin
│   │   ├── services/     # Proxmox, Wompi
│   │   ├── middleware/   # Auth JWT
│   │   └── server.js     # Entry point
│   └── src/              # Frontend HTML/CSS/JS
│       ├── panel/        # Login
│       └── dashboard/    # Dashboard cliente
├── postgres/
│   └── migrations/       # SQL migrations en orden
├── backup/               # Scripts de backup
├── docs/                 # Documentación
└── docker-compose*.yml   # Servicios de producción
```
