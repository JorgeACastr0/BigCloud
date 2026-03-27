markdown
---
name: Setup Local - Desarrollo
globs: ["**/SETUP-LOCAL.md", "**/backend/.env", "**/postgres/migrations/*.sql", "**/docker-compose*.yml", "**/README.md"]
alwaysApply: false
description: Instrucciones de configuración local, estructura del proyecto y comandos de desarrollo.
---

# 🛠️ Setup Local - BigCloud

## 📁 Estructura del Proyecto
BigCloud/
├── bigdata-website/
│ ├── backend/ # API Node.js (puerto 3006)
│ │ ├── routes/ # Endpoints: cloud, payment, admin
│ │ ├── services/ # Proxmox, Wompi
│ │ ├── middleware/ # Auth JWT
│ │ └── server.js
│ └── src/ # Frontend
│ ├── panel/ # Login
│ └── dashboard/ # Dashboard cliente
├── postgres/
│ └── migrations/ # SQL en orden numérico
├── backup/
├── docs/
└── docker-compose*.yml

text

## 🐘 Levantar PostgreSQL Local
```bash
docker run -d \
  --name postgres-local \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD="BigData_Postgres_2025_Secure!" \
  -e POSTGRES_DB=bigdata_isp_v2 \
  -p 5432:5432 \
  postgres:15
Verificar:

bash
docker exec -it postgres-local psql -U admin -d bigdata_isp_v2 -c "\dt"
📜 Migraciones (orden correcto)
Orden	Archivo
1	001_initial_schema.sql
2	002_indexes_and_constraints.sql
3	003_correct_plans.sql
4	004_pagos.sql
Ejecutar en PowerShell:

powershell
Get-Content "postgres\migrations\001_initial_schema.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\002_indexes_and_constraints.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\003_correct_plans.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
Get-Content "postgres\migrations\004_pagos.sql" | docker exec -i postgres-local psql -U admin -d bigdata_isp_v2
👤 Crear Usuario Admin de Prueba
bash
cd bigdata-website/backend
npm install
node fix-admin.js
Credenciales: admin@test.com / 123456

🚀 Iniciar Servicios
Servicio	Comando	URL
Backend	cd bigdata-website/backend && npm start	http://localhost:3006
Frontend	cd bigdata-website/src && npx http-server -p 8080 --proxy http://localhost:3006	http://localhost:8080
Accesos:

Login: http://localhost:8080/panel/

Dashboard: http://localhost:8080/dashboard/

🔄 Flujo de Trabajo Diario
bash
git pull origin main
# trabajar...
git add .
git commit -m "feat: descripción"
git push origin main
📌 Reglas de Respuesta para Desarrollo
Al sugerir cambios en backend, mencionar la carpeta específica (routes/, services/, etc.).

Para migraciones, respetar el orden numérico de los archivos.

Al referirse al frontend, distinguir entre panel/ (login) y dashboard/ (cliente).

No compartir credenciales reales en respuestas.

Usar los comandos exactos de Docker y npm como están documentados.

text

---

## 📂 Estructura final de `rules/`
C:\stack\big-cloud\BigCloud.continue\rules
├── 00-contexto-general.md # Visión, hardware, planes, roadmap
├── 01-setup-desarrollo.md # Setup local, comandos, estructura (con globs)
├── 02-entorno-ollama.md # Configuración del servidor IA

text

---

## 🔄 Próximos pasos

1. **Elimina** el archivo actual que tiene las dos reglas mezcladas
2. **Crea** `02-entorno-ollama.md` con el contenido de arriba
3. **Actualiza** `01-setup-desarrollo.md` con la versión limpia que te di
4. **Asegúrate** de que `00-contexto-general.md` sigue existiendo
5. **Recarga** VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")
6. **Verifica** en el chat (ícono del lápiz) que aparecen las 3 reglas

¿Quieres que te confirme cómo quedan los otros dos archivos (`00` y `02`) completos para copiar?