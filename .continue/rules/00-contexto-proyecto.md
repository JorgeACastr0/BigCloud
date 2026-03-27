---
name: Contexto General - BigCloud
alwaysApply: true
description: Vision del proyecto, arquitectura, hardware, planes VPS y roadmap.
---

# Proyecto BigCloud - Cloud Local Colombia

## Vision General
Proveedor de infraestructura cloud local en Colombia combinando: VPS (CT y KVM), Hosting web, Venta de dominios, DNS gestionado, Reverse proxy con SSL automatico, Inferencia de IA integrada, Infraestructura propia (ASN, BGP, ISP).

Vision a largo plazo: Peering con grandes proveedores, CDN, IXP propio.

---

## Infraestructura Actual
- CPU: 2x Xeon E5-2673 v4 (40 cores / 80 threads)
- RAM: 128 GB DDR4
- GPU: RTX 3060 12GB VRAM
- Almacenamiento: NVMe 1TB + HDD 1TB
- Red: Quad Intel 1Gb (LACP), ASN propio, bloque /23, BGP activo
- Sistema: Proxmox VE

---

## Arquitectura de Servicios
| Componente | Tecnologia |
|------------|------------|
| Backend | Node.js |
| Automatizacion | n8n |
| Base de datos | PostgreSQL |
| Cache/colas | Redis |
| DNS | Technitium DNS |
| Proxy | Nginx Proxy Manager |

---

## Planes VPS

| Tipo | Planes (USD) |
|------|--------------|
| CT (LXC) | XS: $2.5, S: $4, M: $7, L: $12, XL: $20 |
| KVM | XS: $6, S: $10, M: $18, L: $35, XL: $65 |

---

## Flujo Tecnico VPS
1. Usuario solicita -> 2. Backend (CREATING) -> 3. Cola Redis -> 4. Worker -> Proxmox API -> 5. PROVISIONING -> ASSIGNING_IP -> CONFIGURING -> ACTIVE/ERROR

---

## Seguridad (Pendiente)
- Eliminar credenciales hardcodeadas
- Passwords unicos por VM
- Bloquear SMTP outbound
- fail2ban base

---

## Roadmap
| Plazo | Objetivos |
|-------|-----------|
| Corto | seguridad basica, backups, facturacion |
| Medio | cluster Proxmox, VXLAN, DNS API |
| Largo | multihoming BGP, peering, CDN, IXP |

---

## Estado Actual
MVP avanzado listo para produccion inicial. Diferenciadores: IA integrada + infraestructura propia.