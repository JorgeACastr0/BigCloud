# 📊 Proyecto Cloud BigData - Documento Técnico y de Negocio

## 🧠 Visión General

Este proyecto tiene como objetivo construir un proveedor de infraestructura cloud local en Colombia, combinando:

* VPS (CT y KVM)
* Hosting web
* Venta de dominios
* DNS gestionado
* Reverse proxy con SSL automático
* Inferencia de IA integrada
* Infraestructura propia (ASN, BGP, ISP)

La visión a largo plazo incluye:

* Peering con grandes proveedores (Google, Meta, Akamai)
* Evolución hacia CDN
* Creación de un IXP propio

---

# 🏗️ Infraestructura Actual

## Hardware Nodo Principal

* CPU: 2x Xeon E5-2673 v4 (40 cores / 80 threads)
* RAM: 128 GB DDR4
* Almacenamiento:

  * NVMe: 1 TB (alto rendimiento)
  * HDD: 1 TB (secundario)
* GPU: RTX 3060 12GB VRAM
* Red: Tarjeta quad Intel 1Gb (LACP)
* Fuente: 850W Gold
* Sistema: Proxmox VE

## Red

* ASN propio
* Bloque IP: /23 (512 IPs)
* BGP activo con proveedor upstream
* Túneles actuales: EOIP (futuro VXLAN)
* Firewall: Mikrotik

## Energía

* Sistema solar + baterías AGM
* Consumo estimado: 120k–150k COP/mes
* Autonomía: ~6 horas

---

# 💰 Inversión Inicial

Total invertido:

**5.810.211 COP (~1450 USD)**

---

# 📦 Arquitectura de Servicios

## Componentes principales

* Backend: Node.js
* Automatización: n8n
* Base de datos: PostgreSQL (servidor separado)
* Cache/colas: Redis
* Frontend: Panel web propio
* DNS: Technitium DNS
* Proxy: Nginx Proxy Manager

---

# ⚙️ Funcionalidades del Sistema

## Panel de Usuario

* Registro/Login
* Creación de VPS (CT y KVM)
* Gestión:

  * Encendido/apagado/reinicio
  * Eliminación
  * Consola NoVNC
* Selección de:

  * Plan
  * Sistema operativo
  * Nombre de la máquina

---

## Automatización

Flujo:

1. Usuario crea cuenta
2. Verificación por SMS (Twilio)
3. Email automático (Gmail API)
4. Pago (Wompi)
5. Creación de VPS (Proxmox API vía túnel seguro)
6. Asignación de IP
7. Acceso al dashboard

---

# 🧠 Modelo de Infraestructura

## Virtualización

* CT (LXC): alta eficiencia
* KVM: mayor aislamiento

## Overselling

* CPU: hasta 3x
* RAM: máximo 1.5x (ideal 1.3x)
* Disco:

  * NVMe: uso controlado
  * HDD: thin provisioning

---

# 📊 Capacidad del Nodo

## Con IA integrada:

* ~85 VPS totales:

  * 70 CT
  * 15 KVM

---

# 💰 Modelo de Negocio

## Ingresos estimados

* CT promedio: $5 USD
* KVM promedio: $15 USD

Total:

**~575 USD/mes**

---

## Costos operativos

* Energía: $35 USD
* VPS externo: $5 USD
* Otros: $20 USD

Total:

**~60 USD/mes**

---

## Utilidad

**~500 USD/mes (~2M COP)**

---

## ROI

* Recuperación inversión: **3–4 meses**

---

# 📈 Estrategia de Escalamiento

* Expandir al 65–70% de uso (~60 VPS)
* Reinvertir en:

  * segundo NVMe
  * nuevo nodo

---

# 💾 Estrategia de Almacenamiento

## Plan futuro

* 3 HDD 12TB (RAIDZ1)
* NVMe como cache (L2ARC)

## Uso:

* NVMe:

  * VPS premium
* HDD:

  * planes económicos
  * backups

---

# 🔐 Seguridad

## Implementado / requerido

* Tokens rotativos para API Proxmox
* Túneles seguros
* Firewall perimetral (Mikrotik)

## Pendiente (crítico)

* eliminación de credenciales hardcodeadas
* passwords únicos por VM
* bloqueo SMTP outbound
* fail2ban base

---

# 📊 Monitoreo

## Stack definido

* Node-RED
* InfluxDB
* Grafana
* Raspberry Pi (quorum + monitoreo físico)

## Métricas:

* CPU
* RAM
* temperatura
* consumo eléctrico
* red

---

# 🌐 Dominios (Nuevo Servicio)

## Estrategia

* Revender mediante API (Openprovider / ResellerClub)

## Funcionalidades:

* búsqueda de dominio
* compra automática
* asignación DNS
* integración con VPS

---

# 🤖 IA COMO SERVICIO

## Hardware

* GPU RTX 3060 (12GB)

## Modelos

* Qwen 9B (principal)
* Mistral 7B (rápido)
* LLaMA 3 8B (opcional)

## Configuración

* cuantización 4-bit (GGUF)
* ejecución local

---

## Capacidad

* ~30M tokens/mes

---

## Modelo de negocio

* IA incluida en planes
* tokens limitados por usuario
* venta adicional de tokens

---

# 📦 Planes VPS

## CT (LXC)

| Plan | CPU | RAM   | Disco | Precio |
| ---- | --- | ----- | ----- | ------ |
| XS   | 1   | 512MB | 5GB   | $2.5   |
| S    | 1   | 1GB   | 10GB  | $4     |
| M    | 2   | 2GB   | 20GB  | $7     |
| L    | 2   | 4GB   | 40GB  | $12    |
| XL   | 4   | 8GB   | 80GB  | $20    |

---

## KVM

| Plan | CPU | RAM  | Disco | Precio |
| ---- | --- | ---- | ----- | ------ |
| XS   | 1   | 1GB  | 20GB  | $6     |
| S    | 2   | 2GB  | 40GB  | $10    |
| M    | 2   | 4GB  | 80GB  | $18    |
| L    | 4   | 8GB  | 160GB | $35    |
| XL   | 6   | 16GB | 320GB | $65    |

---

# 🔁 Flujo Técnico VPS

1. Usuario solicita VPS
2. Backend registra estado: CREATING
3. Cola Redis procesa
4. Worker llama Proxmox API
5. Estados:

   * PROVISIONING
   * ASSIGNING_IP
   * CONFIGURING
   * ACTIVE / ERROR

---

# 🚀 Roadmap

## Corto plazo

* seguridad básica
* backups
* estados de sistema
* facturación

## Medio plazo

* cluster Proxmox
* VXLAN
* DNS API
* proxy automático

## Largo plazo

* multihoming BGP
* peering
* CDN
* IXP

---

# 🎯 Conclusión

Este proyecto ya se encuentra en fase de:

👉 **MVP avanzado listo para producción inicial**

Con:

* infraestructura real
* modelo rentable
* diferenciadores claros (IA + red propia)

El éxito depende de:

* control de recursos
* automatización robusta
* crecimiento progresivo

---

# 📌 Nota Final

Este documento define:

* arquitectura base
* decisiones técnicas
* modelo financiero
* estrategia de crecimiento

Debe ser usado como guía principal para el desarrollo del sistema con herramientas como Claude Code.
