# Guía Técnica: Reventa de Dominios para BigCloudMiami

> **Versión:** 1.0 | **Fecha:** Marzo 2026 | **Audiencia:** Equipo técnico y directivo de BigCloudMiami
>
> Esta guía está diseñada para ser accionable. Si tienes la infraestructura lista, puedes iniciar el proceso de registro con un proveedor reseller esta semana.

---

## Tabla de Contenidos

1. [Comparativa de Proveedores Reseller](#1-comparativa-de-proveedores-reseller)
2. [Análisis Financiero](#2-análisis-financiero)
3. [Guía Paso a Paso de Implementación](#3-guía-paso-a-paso-de-implementación)
4. [Consideraciones Legales en Colombia](#4-consideraciones-legales-en-colombia)
5. [Plan de Implementación Recomendado](#5-plan-de-implementación-recomendado)
6. [Estimación de Esfuerzo de Desarrollo](#6-estimación-de-esfuerzo-de-desarrollo)

---

## 1. Comparativa de Proveedores Reseller

> **Nota sobre precios:** Los precios mayoristas varían según volumen, tipo de cambio y negociaciones. Los valores indicados son aproximados para 2025-2026. Verifica siempre los precios actuales en el portal de cada proveedor antes de tomar decisiones financieras.

---

### 1.1 Openprovider

- **Sitio:** https://www.openprovider.com
- **Portal reseller:** https://cp.openprovider.com
- **Documentación API:** https://docs.openprovider.com
- **Registro reseller:** https://www.openprovider.com/become-a-reseller/

**Costo de apertura:** Gratis. Sin depósito mínimo obligatorio, pero recomiendan cargar USD 50–100 para operar con fluidez.

**Precios mayoristas aproximados (USD/año):**

| TLD | Precio mayorista | Precio venta sugerido (+40%) | Margen |
|-----|-----------------|------------------------------|--------|
| .com | ~$8.57 | ~$12.00 | ~$3.43 |
| .net | ~$9.50 | ~$13.50 | ~$4.00 |
| .org | ~$9.00 | ~$13.00 | ~$4.00 |
| .co | ~$22.00 | ~$32.00 | ~$10.00 |
| .com.co | ~$14.00 | ~$20.00 | ~$6.00 |
| .io | ~$32.00 | ~$46.00 | ~$14.00 |

**Calidad de API:**
- Tipo: REST + XML-RPC (ambas disponibles)
- Documentación: Excelente, con ejemplos en PHP, Python, y colección Postman disponible
- SDK oficial: Python (también usable como referencia para Node.js)
- Sandbox de pruebas: Disponible

**Soporte:**
- Idioma: Inglés, Holandés (sin soporte oficial en español)
- Canal: Ticket, chat en vivo, email
- Tiempo de respuesta: 2–8 horas en horario europeo (UTC+1)

**Requisitos para registrarse:**
- Empresa o persona natural con actividad de TI/hosting
- Documentos de identidad del representante legal
- Descripción del negocio (reventa de dominios/hosting)
- No requiere acreditación ICANN propia

**Pros:**
- Amplio catálogo de TLDs (1000+)
- API moderna y bien documentada
- Precios competitivos en volumen
- Panel de reseller robusto con whitelabel

**Contras:**
- Sin soporte en español
- Orientado al mercado europeo; soporte fuera de horario europeo es lento
- Curva de aprendizaje inicial moderada

**Calificación general:** ⭐⭐⭐⭐ (4/5)

---

### 1.2 LogicBoxes / ResellerClub

- **Sitio:** https://www.resellerclub.com
- **Documentación API:** https://manage.resellerclub.com/kb/answer/744
- **Registro:** https://www.resellerclub.com/register

**Costo de apertura:** Gratis. Sin depósito mínimo.

**Precios mayoristas aproximados (USD/año):**

| TLD | Precio mayorista | Precio venta sugerido (+40%) | Margen |
|-----|-----------------|------------------------------|--------|
| .com | ~$9.25 | ~$13.00 | ~$3.75 |
| .net | ~$10.50 | ~$15.00 | ~$4.50 |
| .org | ~$9.75 | ~$14.00 | ~$4.25 |
| .co | ~$24.00 | ~$34.00 | ~$10.00 |
| .com.co | ~$16.00 | ~$23.00 | ~$7.00 |
| .io | ~$34.00 | ~$48.00 | ~$14.00 |

**Calidad de API:**
- Tipo: HTTP API (REST-like sobre GET/POST con parámetros)
- Documentación: Extensa pero algo desactualizada en algunos endpoints
- SDK: No oficial, pero hay librerías Node.js en npm creadas por la comunidad
- Sandbox: Disponible (sandbox.resellerclub.com)

**Soporte:**
- Idioma: Inglés y algunos agentes en español (limitado)
- Canal: Chat, ticket, teléfono
- Tiempo de respuesta: 1–4 horas

**Requisitos para registrarse:**
- Registro de empresa o freelance
- Email corporativo recomendado
- No requiere ICANN

**Pros:**
- Muy popular en Latinoamérica y Asia
- Soporte 24/7
- Panel completo de gestión de clientes incluido (WHMCS-compatible)
- Amplia comunidad y recursos en español

**Contras:**
- API más antigua (HTTP params, no JSON nativo)
- Precios ligeramente más altos que Openprovider
- La plataforma puede sentirse desactualizada
- Reciente adquisición por Newfold Digital genera incertidumbre sobre roadmap

**Calificación general:** ⭐⭐⭐½ (3.5/5)

---

### 1.3 Hexonet

- **Sitio:** https://www.hexonet.net
- **Documentación API:** https://wiki.hexonet.net/wiki/Domain_API
- **Registro:** https://www.hexonet.net/become-a-reseller

**Costo de apertura:** Gratis. Depósito inicial recomendado: USD 100–200.

**Precios mayoristas aproximados (USD/año):**

| TLD | Precio mayorista | Precio venta sugerido (+40%) | Margen |
|-----|-----------------|------------------------------|--------|
| .com | ~$8.35 | ~$12.00 | ~$3.65 |
| .net | ~$9.20 | ~$13.00 | ~$3.80 |
| .org | ~$8.80 | ~$12.50 | ~$3.70 |
| .co | ~$21.00 | ~$30.00 | ~$9.00 |
| .com.co | ~$13.50 | ~$19.00 | ~$5.50 |
| .io | ~$31.00 | ~$44.00 | ~$13.00 |

**Calidad de API:**
- Tipo: HTTP API propietaria (muy madura), también tiene SDK en PHP y Java
- Documentación: Técnicamente muy detallada; wiki extenso
- Node.js SDK: https://github.com/hexonet/node-sdk (oficial)
- Sandbox: Disponible (Operational Test Environment - OT&E)

**Soporte:**
- Idioma: Inglés, Alemán
- Canal: Ticket, email
- Tiempo de respuesta: 4–12 horas (menos ágil que otros)

**Requisitos:**
- Empresa legalmente constituida preferible
- Proceso de aprobación puede tomar 1–3 días hábiles

**Pros:**
- SDK oficial para Node.js (gran ventaja para BigCloudMiami)
- Precios de los más bajos del mercado
- Acceso a TLDs premium y nuevos gTLDs
- Muy estable y confiable técnicamente

**Contras:**
- Sin soporte en español
- Interfaz del panel menos amigable
- Soporte más lento
- Menos documentación en casos de uso comunes

**Calificación general:** ⭐⭐⭐⭐ (4/5)

---

### 1.4 Enom / Tucows

- **Sitio:** https://www.enom.com
- **Portal reseller:** https://www.enom.com/reseller/
- **Documentación API:** https://www.enom.com/APICommandCatalog/

**Costo de apertura:** Gratis. Depósito recomendado: USD 50+.

**Precios mayoristas aproximados (USD/año):**

| TLD | Precio mayorista | Precio venta sugerido (+40%) | Margen |
|-----|-----------------|------------------------------|--------|
| .com | ~$9.00 | ~$13.00 | ~$4.00 |
| .net | ~$10.00 | ~$14.00 | ~$4.00 |
| .org | ~$9.50 | ~$13.50 | ~$4.00 |
| .co | ~$23.00 | ~$33.00 | ~$10.00 |
| .com.co | ~$15.00 | ~$21.00 | ~$6.00 |
| .io | ~$33.00 | ~$47.00 | ~$14.00 |

**Calidad de API:**
- Tipo: XML sobre HTTPS (API clásica)
- Documentación: Extensa pero formato antiguo (XML)
- Node.js: No hay SDK oficial; necesitas parsear XML manualmente o usar una librería
- Sandbox: Disponible (resellertest.enom.com)

**Soporte:**
- Idioma: Solo inglés
- Canal: Ticket, teléfono (EE.UU.)
- Tiempo de respuesta: 2–6 horas

**Requisitos:**
- Residencia o empresa en EE.UU. preferible (aunque aceptan internacionales)
- Proceso simple de registro

**Pros:**
- Una de las registradoras más antiguas y confiables
- Amplio catálogo de TLDs
- Buena integración con WHMCS

**Contras:**
- API en XML, menos moderna
- Sin soporte en español
- Interfaz desactualizada
- Tucows está desinvirtiendo en Enom, lo que genera incertidumbre de largo plazo

**Calificación general:** ⭐⭐⭐ (3/5)

---

### 1.5 Namecheap Reseller

- **Sitio:** https://www.namecheap.com/reseller/
- **Documentación API:** https://www.namecheap.com/support/api/intro/
- **Registro:** https://ap.www.namecheap.com/signup

**Costo de apertura:** Gratis. Sin depósito mínimo (pero la API requiere mínimo USD 50 en cuenta o 20+ dominios para activarla).

**Precios mayoristas aproximados (USD/año):**

| TLD | Precio mayorista | Precio venta sugerido (+40%) | Margen |
|-----|-----------------|------------------------------|--------|
| .com | ~$9.16 | ~$13.00 | ~$3.84 |
| .net | ~$10.16 | ~$14.50 | ~$4.34 |
| .org | ~$9.66 | ~$13.75 | ~$4.09 |
| .co | ~$25.16 | ~$35.00 | ~$9.84 |
| .com.co | ~$15.00 | ~$21.00 | ~$6.00 |
| .io | ~$32.98 | ~$46.00 | ~$13.02 |

> Namecheap tiene descuentos por volumen escalonados. Los precios del año 1 pueden ser más bajos como promoción.

**Calidad de API:**
- Tipo: REST con respuestas XML (bien estructurada)
- Documentación: Excelente, con ejemplos claros
- Node.js: No oficial, pero https://www.npmjs.com/package/namecheap-api es un wrapper funcional
- Sandbox: Disponible (sandbox.namecheap.com)

**Soporte:**
- Idioma: Inglés (algunos agentes hablan español informalmente)
- Canal: Chat en vivo, ticket, foros
- Tiempo de respuesta: 1–3 horas (chat muy ágil)

**Requisitos:**
- Registro simple sin requisitos empresariales estrictos
- Para API: necesitas IP whitelistada y mínimo de actividad en cuenta

**Pros:**
- Marca conocida y confiable (buena reputación para mostrar a clientes)
- Soporte por chat muy rápido
- Documentación de API muy clara
- Precios competitivos en promociones

**Contras:**
- Requiere actividad mínima para activar API (barrera inicial)
- No es el más barato en precio base
- Menos TLDs raros que Hexonet/Openprovider
- API en XML (no JSON puro)

**Calificación general:** ⭐⭐⭐⭐ (4/5)

---

### Tabla Comparativa Resumen

| Proveedor | Apertura | .com mayorista | API | Soporte ES | Calificación |
|-----------|----------|---------------|-----|------------|-------------|
| Openprovider | Gratis | ~$8.57 | REST/XML-RPC | No | 4/5 |
| ResellerClub | Gratis | ~$9.25 | HTTP params | Limitado | 3.5/5 |
| Hexonet | Gratis | ~$8.35 | HTTP + Node SDK | No | 4/5 |
| Enom/Tucows | Gratis | ~$9.00 | XML | No | 3/5 |
| Namecheap | Gratis | ~$9.16 | REST/XML | Informal | 4/5 |

---

### Recomendacion: Cual elegir para Colombia

**Recomendacion principal: Openprovider**

**Justificacion:**

1. **Precios mayoristas competitivos** sin necesidad de volumen inicial alto
2. **API REST moderna** con documentacion excelente — reducira el tiempo de desarrollo en integracion
3. **Coleccion Postman disponible** — el equipo puede probar endpoints inmediatamente
4. **Sin deposito minimo obligatorio** — podras arrancar con una inversion inicial minima
5. **Panel whitelabel** — permite presentar el servicio completamente bajo la marca BigCloudMiami
6. **Catalogo amplio de TLDs** — incluye .co y .com.co que son criticos para el mercado colombiano

**Alternativa recomendada: Hexonet** si el equipo prioriza tener un SDK oficial en Node.js desde el primer dia (https://github.com/hexonet/node-sdk), lo que reduce el tiempo de desarrollo de integracion significativamente.

**Por que no los demas para empezar:**
- ResellerClub: API mas antigua, precios ligeramente mayores
- Enom: Incertidumbre estrategica por desinversion de Tucows
- Namecheap: La barrera de activacion de API complica el arranque

**URL de registro Openprovider:** https://cp.openprovider.com/account/register.php

---

## 2. Analisis Financiero

### 2.1 Costos Iniciales

| Concepto | Costo (USD) | Costo (COP aprox. a $4,200/USD) |
|----------|-------------|----------------------------------|
| Apertura cuenta Openprovider | $0 | $0 |
| Deposito inicial recomendado | $100 | $420,000 |
| Desarrollo e integracion (ver Seccion 6) | $800–$2,400 | $3,360,000–$10,080,000 |
| Infraestructura adicional | $0 | $0 (usa VPS existente) |
| **Total inicial estimado** | **$900–$2,500** | **$3,780,000–$10,500,000** |

> La infraestructura existente (VPS, DNS, PostgreSQL) cubre todos los requisitos tecnicos. No hay costos adicionales de servidor.

---

### 2.2 Proyeccion de Ingresos a 12 Meses

**Supuestos base:**
- Precio de venta promedio .com: $13 USD/año
- Costo mayorista promedio .com: $8.57 USD/año
- Margen bruto unitario: ~$4.43 USD por dominio
- TRM utilizada: $4,200 COP/USD (ajustar segun mercado)

#### Escenario Conservador: 10 dominios/mes inicio, crecimiento 20% mensual

| Mes | Dominios/mes | Ingreso bruto (USD) | Costo mayorista (USD) | Margen bruto (USD) |
|-----|--------------|--------------------|-----------------------|-------------------|
| 1 | 10 | $130 | $86 | $44 |
| 2 | 12 | $156 | $103 | $53 |
| 3 | 14 | $182 | $120 | $62 |
| 4 | 17 | $221 | $146 | $75 |
| 5 | 20 | $260 | $171 | $89 |
| 6 | 24 | $312 | $206 | $106 |
| 7 | 29 | $377 | $249 | $128 |
| 8 | 35 | $455 | $300 | $155 |
| 9 | 42 | $546 | $360 | $186 |
| 10 | 50 | $650 | $429 | $221 |
| 11 | 60 | $780 | $514 | $266 |
| 12 | 72 | $936 | $617 | $319 |
| **TOTAL** | **385** | **$5,005** | **$3,301** | **$1,704** |

**ROI Conservador (año 1):** Inversion $900 → Margen acumulado $1,704 → ROI ~89%

#### Escenario Moderado: 25 dominios/mes inicio, crecimiento 30% mensual

| Mes | Dominios/mes | Ingreso bruto (USD) | Costo mayorista (USD) | Margen bruto (USD) |
|-----|--------------|--------------------|-----------------------|-------------------|
| 1 | 25 | $325 | $214 | $111 |
| 2 | 33 | $429 | $283 | $146 |
| 3 | 43 | $559 | $369 | $190 |
| 4 | 56 | $728 | $480 | $248 |
| 5 | 73 | $949 | $626 | $323 |
| 6 | 95 | $1,235 | $815 | $420 |
| 7 | 124 | $1,612 | $1,063 | $549 |
| 8 | 161 | $2,093 | $1,381 | $712 |
| 9 | 209 | $2,717 | $1,792 | $925 |
| 10 | 272 | $3,536 | $2,332 | $1,204 |
| 11 | 354 | $4,602 | $3,035 | $1,567 |
| 12 | 460 | $5,980 | $3,945 | $2,035 |
| **TOTAL** | **1,905** | **$24,765** | **$16,335** | **$8,430** |

**ROI Moderado (año 1):** Inversion $1,500 → Margen acumulado $8,430 → ROI ~462%

#### Escenario Optimista: 50 dominios/mes inicio, crecimiento 40% mensual

| Mes | Dominios/mes | Ingreso bruto (USD) | Costo mayorista (USD) | Margen bruto (USD) |
|-----|--------------|--------------------|-----------------------|-------------------|
| 1 | 50 | $650 | $429 | $221 |
| 2 | 70 | $910 | $600 | $310 |
| 3 | 98 | $1,274 | $840 | $434 |
| 4 | 137 | $1,781 | $1,175 | $606 |
| 5 | 192 | $2,496 | $1,646 | $850 |
| 6 | 269 | $3,497 | $2,306 | $1,191 |
| 7 | 377 | $4,901 | $3,231 | $1,670 |
| 8 | 528 | $6,864 | $4,525 | $2,339 |
| 9 | 739 | $9,607 | $6,333 | $3,274 |
| 10 | 1,035 | $13,455 | $8,872 | $4,583 |
| 11 | 1,449 | $18,837 | $12,420 | $6,417 |
| 12 | 2,028 | $26,364 | $17,380 | $8,984 |
| **TOTAL** | **6,972** | **$90,636** | **$59,757** | **$30,879** |

> El escenario optimista requiere infraestructura de ventas y marketing activa. No es automatico.

---

### 2.3 TLDs Mas Rentables para Colombia

| TLD | Precio mayorista (USD) | Precio venta (USD) | Margen (USD) | Demanda estimada Colombia |
|-----|----------------------|-------------------|--------------|--------------------------|
| .com | $8.57 | $13.00 | $4.43 | Muy alta |
| .com.co | $14.00 | $22.00 | $8.00 | Alta (identidad local) |
| .co | $22.00 | $34.00 | $12.00 | Media-alta (tech/startups) |
| .net | $9.50 | $14.00 | $4.50 | Media |
| .io | $32.00 | $48.00 | $16.00 | Media (nicho tech/SaaS) |
| .org | $9.00 | $13.00 | $4.00 | Baja-media (ONGs) |
| .app | ~$14.00 | $22.00 | $8.00 | Creciente (apps moviles) |
| .dev | ~$12.00 | $19.00 | $7.00 | Creciente (desarrolladores) |
| .store | ~$8.00 | $14.00 | $6.00 | Media (e-commerce) |

**Estrategia recomendada:** Promocionar agresivamente .com.co como TLD "colombiano oficial" con precio accessible (~$22 USD = ~$92,400 COP), ya que tiene buena identidad de marca local y margen saludable.

---

## 3. Guia Paso a Paso de Implementacion

### Fase 1: Registro y Configuracion (Semana 1-2)

#### Paso 1: Crear cuenta en Openprovider

1. Ir a: https://cp.openprovider.com/account/register.php
2. Seleccionar tipo de cuenta: **Reseller**
3. Completar datos de la empresa:
   - Nombre legal de la empresa (ej: BigCloudMiami SAS)
   - NIT colombiano
   - Direccion fisica en Colombia
   - Datos del representante legal
4. Verificar email corporativo
5. Esperar aprobacion (normalmente 1-2 dias habiles)

#### Paso 2: Documentos necesarios

- Certificado de existencia y representacion legal (Camara de Comercio, no mayor a 90 dias)
- Documento de identidad del representante legal (cedula o pasaporte)
- Comprobante de domicilio empresarial (factura de servicios)
- Email corporativo del dominio de la empresa

> Openprovider puede solicitar estos documentos durante el proceso de KYC. Tenlos escaneados en PDF de alta calidad.

#### Paso 3: Configuracion inicial del portal

1. Ingresar al panel: https://cp.openprovider.com
2. Ir a **Account > Settings > Reseller Settings**
3. Configurar:
   - **Nombre de marca reseller** (BigCloudMiami)
   - **Logo** para portal whitelabel
   - **Moneda de operacion:** USD (recomendado para costos, convertir a COP en tu plataforma)
   - **Zona horaria:** America/Bogota (UTC-5)
4. En **API > Credentials**, generar credenciales de acceso

#### Paso 4: Hacer el deposito inicial

1. Ir a **Account > Financial > Add Funds**
2. Opciones de pago disponibles:
   - Transferencia SWIFT (recomendado para Colombia, coordinar con banco)
   - Tarjeta de credito/debito internacional
   - PayPal
3. Depositar minimo USD 100 para operar con comodidad
4. Para transferencia SWIFT desde Colombia, usa:
   - Datos bancarios proporcionados por Openprovider en el panel
   - Tu banco colombiano necesitara declaracion de cambio (Form 4 o 5 del Banco de la Republica para pagos al exterior)

> **Importante:** Los pagos al exterior en Colombia requieren declaracion de cambio si superan USD 10,000. Para montos menores, algunos bancos lo procesan automaticamente. Consulta con tu banco (Bancolombia, Davivienda, etc.) sobre el proceso especifico.

#### Paso 5: Obtener credenciales API

1. En el panel ir a: **Account > API Access**
2. Crear nuevo token de API:
   - Nombre: `bigcloudmiami-production`
   - Permisos: Domains (check, register, renew, delete, update)
3. Anotar:
   - **API Username:** (tu usuario del portal)
   - **API Password/Token:** (guardar en vault seguro)
   - **Endpoint produccion:** `https://api.openprovider.eu/v1beta/`
   - **Endpoint sandbox:** `https://api.cte.openprovider.eu/v1beta/`

---

### Fase 2: Integracion Tecnica (Semana 3-4)

#### A. Busqueda de Disponibilidad de Dominio

```javascript
// services/domainService.js
// Requiere: npm install axios dotenv

const axios = require('axios');

const OPENPROVIDER_API = process.env.OPENPROVIDER_API_URL || 'https://api.openprovider.eu/v1beta';
const OPENPROVIDER_TOKEN = process.env.OPENPROVIDER_TOKEN;

/**
 * Autentica con Openprovider y retorna un token JWT de sesion
 */
async function getAuthToken() {
  const response = await axios.post(`${OPENPROVIDER_API}/auth/login`, {
    username: process.env.OPENPROVIDER_USERNAME,
    password: process.env.OPENPROVIDER_PASSWORD
  });
  return response.data.data.token;
}

/**
 * Verifica disponibilidad de un dominio
 * @param {string} domain - ej: "miempresa.com"
 * @returns {Object} { available: boolean, price: number, tld: string }
 */
async function checkDomainAvailability(domain) {
  const token = await getAuthToken();

  const parts = domain.split('.');
  const name = parts[0];
  const tld = parts.slice(1).join('.');

  try {
    const response = await axios.post(
      `${OPENPROVIDER_API}/domains/check`,
      {
        domains: [
          {
            name: name,
            extension: tld
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = response.data.data.results[0];

    return {
      domain: domain,
      available: result.status === 'free',
      status: result.status, // 'free', 'taken', 'invalid'
      price: result.price ? result.price.product.price : null,
      premium: result.premium || false
    };
  } catch (error) {
    throw new Error(`Error verificando disponibilidad: ${error.message}`);
  }
}

/**
 * Verifica disponibilidad de multiples dominios en paralelo
 * @param {string} name - nombre sin extension, ej: "miempresa"
 * @param {string[]} tlds - array de TLDs, ej: ['.com', '.co', '.com.co']
 */
async function checkMultipleDomains(name, tlds = ['.com', '.co', '.com.co', '.net']) {
  const token = await getAuthToken();

  const domains = tlds.map(tld => ({
    name: name,
    extension: tld.replace('.', '')
  }));

  const response = await axios.post(
    `${OPENPROVIDER_API}/domains/check`,
    { domains },
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  return response.data.data.results.map(result => ({
    domain: `${name}.${result.extension}`,
    available: result.status === 'free',
    status: result.status,
    price: result.price ? result.price.product.price : null
  }));
}

module.exports = { checkDomainAvailability, checkMultipleDomains };
```

#### B. Registro de Dominio

```javascript
// services/domainRegistrationService.js

const axios = require('axios');
const { getAuthToken } = require('./domainService');
const { pool } = require('../db/pool'); // tu conexion PostgreSQL

const OPENPROVIDER_API = process.env.OPENPROVIDER_API_URL || 'https://api.openprovider.eu/v1beta';

/**
 * Registra un dominio con Openprovider
 * @param {Object} params
 * @param {string} params.domain - ej: "miempresa.com"
 * @param {number} params.period - anos de registro (1-10)
 * @param {Object} params.owner - datos del registrante
 * @param {string[]} params.nameservers - nameservers a configurar
 * @param {number} params.clienteId - ID del cliente en BigCloudMiami
 * @param {number} params.precioVenta - precio cobrado al cliente en USD
 */
async function registerDomain({
  domain,
  period = 1,
  owner,
  nameservers = ['ns1.bigcloudmiami.com', 'ns2.bigcloudmiami.com'],
  clienteId,
  precioVenta
}) {
  const token = await getAuthToken();

  const [name, ...tldParts] = domain.split('.');
  const extension = tldParts.join('.');

  // Construir datos del contacto para Openprovider
  const contactData = {
    name: owner.nombre,
    last_name: owner.apellido,
    company_name: owner.empresa || '',
    address: {
      street: owner.calle,
      number: owner.numero || 's/n',
      city: owner.ciudad,
      state: owner.departamento,
      country: 'CO', // Colombia
      zip_code: owner.codigoPostal || '110111'
    },
    phone: owner.telefono, // formato: +57.3001234567
    email: owner.email
  };

  const registrationPayload = {
    domain: {
      name: name,
      extension: extension
    },
    period: period,
    owner_c: contactData,
    admin_c: contactData,
    tech_c: contactData,
    billing_c: contactData,
    name_servers: nameservers.map(ns => ({ name: ns })),
    auto_renew: true,
    privacy_protection: false // activar si el cliente lo solicita (puede tener costo adicional)
  };

  try {
    const response = await axios.post(
      `${OPENPROVIDER_API}/domains`,
      registrationPayload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const registrationData = response.data.data;

    // Guardar en base de datos local
    const dbResult = await pool.query(
      `INSERT INTO dominios
        (cliente_id, dominio, tld, fecha_registro, fecha_expiracion,
         auto_renew, estado, proveedor_referencia, precio_costo, precio_venta)
       VALUES ($1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        clienteId,
        domain,
        extension,
        new Date(Date.now() + period * 365 * 24 * 60 * 60 * 1000), // fecha aproximada
        true,
        'active',
        registrationData.id || registrationData.domain?.id,
        registrationData.price || null,
        precioVenta
      ]
    );

    return {
      success: true,
      dominioId: dbResult.rows[0].id,
      proveedorReferencia: registrationData.id,
      domain: domain,
      expiracion: registrationData.expiration_date
    };

  } catch (error) {
    const errorMsg = error.response?.data?.desc || error.message;
    throw new Error(`Error registrando dominio ${domain}: ${errorMsg}`);
  }
}

module.exports = { registerDomain };
```

#### C. Renovacion Automatica

```javascript
// services/renewalService.js
// Ejecutar con cron job: 0 9 * * * (todos los dias a las 9am)

const axios = require('axios');
const { pool } = require('../db/pool');
const { getAuthToken } = require('./domainService');
const { sendEmail } = require('./emailService'); // tu servicio de email

const OPENPROVIDER_API = process.env.OPENPROVIDER_API_URL || 'https://api.openprovider.eu/v1beta';
const DIAS_AVISO_RENOVACION = 30; // avisar 30 dias antes

/**
 * Renovar un dominio especifico
 */
async function renewDomain(dominioId) {
  const dominio = await pool.query(
    'SELECT * FROM dominios WHERE id = $1',
    [dominioId]
  );

  if (!dominio.rows[0]) throw new Error('Dominio no encontrado');

  const d = dominio.rows[0];
  const token = await getAuthToken();

  const [name, ...tldParts] = d.dominio.split('.');

  const response = await axios.post(
    `${OPENPROVIDER_API}/domains/${d.proveedor_referencia}/renew`,
    {
      domain: {
        name: name,
        extension: tldParts.join('.')
      },
      period: 1
    },
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );

  // Actualizar fecha de expiracion en BD
  await pool.query(
    `UPDATE dominios
     SET fecha_expiracion = fecha_expiracion + INTERVAL '1 year',
         updated_at = NOW()
     WHERE id = $1`,
    [dominioId]
  );

  return response.data;
}

/**
 * Job diario: verificar dominios proximos a vencer y renovar los que tienen auto_renew
 */
async function processAutoRenewals() {
  // Obtener dominios que vencen en los proximos 30 dias
  const proximosVencer = await pool.query(
    `SELECT d.*, c.email, c.nombre
     FROM dominios d
     JOIN clientes_cloud c ON d.cliente_id = c.id
     WHERE d.fecha_expiracion <= NOW() + INTERVAL '${DIAS_AVISO_RENOVACION} days'
       AND d.estado = 'active'`
  );

  for (const dominio of proximosVencer.rows) {
    if (dominio.auto_renew) {
      try {
        await renewDomain(dominio.id);
        // Notificar al cliente de la renovacion exitosa
        await sendEmail({
          to: dominio.email,
          subject: `Renovacion automatica: ${dominio.dominio}`,
          body: `Tu dominio ${dominio.dominio} ha sido renovado automaticamente por 1 año.`
        });
      } catch (error) {
        // Si falla la renovacion, notificar urgentemente
        await sendEmail({
          to: dominio.email,
          subject: `URGENTE: Fallo en renovacion de ${dominio.dominio}`,
          body: `No pudimos renovar tu dominio ${dominio.dominio}. Por favor contactanos inmediatamente.`
        });
        console.error(`Error renovando ${dominio.dominio}:`, error.message);
      }
    } else {
      // Solo enviar aviso de proximidad a vencer
      const diasRestantes = Math.ceil(
        (new Date(dominio.fecha_expiracion) - new Date()) / (1000 * 60 * 60 * 24)
      );

      await sendEmail({
        to: dominio.email,
        subject: `Tu dominio ${dominio.dominio} vence en ${diasRestantes} dias`,
        body: `Tu dominio ${dominio.dominio} vence el ${dominio.fecha_expiracion.toLocaleDateString()}.
               Renuevalo en: https://bigcloudmiami.com/dashboard/dominios/${dominio.id}`
      });
    }
  }
}

module.exports = { renewDomain, processAutoRenewals };
```

#### D. Estructura de Base de Datos Sugerida

```sql
-- Tabla principal de dominios
CREATE TABLE dominios (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER REFERENCES clientes_cloud(id) ON DELETE RESTRICT,
  dominio VARCHAR(255) UNIQUE NOT NULL,
  tld VARCHAR(20) NOT NULL,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_expiracion TIMESTAMP WITH TIME ZONE NOT NULL,
  auto_renew BOOLEAN DEFAULT true,
  estado VARCHAR(50) DEFAULT 'pending',
    -- Estados: pending, active, expired, cancelled, transferring
  proveedor_referencia VARCHAR(100), -- ID del dominio en Openprovider
  precio_costo DECIMAL(10,2),        -- Costo mayorista en USD
  precio_venta DECIMAL(10,2),        -- Precio cobrado al cliente en USD
  moneda_venta VARCHAR(3) DEFAULT 'USD',
  nameservers TEXT[],                -- Array de nameservers configurados
  privacy_protection BOOLEAN DEFAULT false,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Historial de operaciones sobre dominios
CREATE TABLE dominios_historial (
  id SERIAL PRIMARY KEY,
  dominio_id INTEGER REFERENCES dominios(id),
  operacion VARCHAR(50) NOT NULL, -- 'registro', 'renovacion', 'transferencia', 'update'
  fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado_resultado VARCHAR(50),   -- 'exito', 'error'
  detalle TEXT,
  costo_operacion DECIMAL(10,2),
  referencia_proveedor VARCHAR(100)
);

-- Configuracion de precios por TLD
CREATE TABLE precios_tld (
  id SERIAL PRIMARY KEY,
  tld VARCHAR(20) UNIQUE NOT NULL,
  precio_costo_usd DECIMAL(10,2) NOT NULL,
  precio_venta_usd DECIMAL(10,2) NOT NULL,
  precio_venta_cop DECIMAL(15,2), -- puede diferir por TRM aplicada
  activo BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar precios iniciales
INSERT INTO precios_tld (tld, precio_costo_usd, precio_venta_usd) VALUES
  ('com', 8.57, 13.00),
  ('net', 9.50, 14.00),
  ('org', 9.00, 13.00),
  ('co', 22.00, 34.00),
  ('com.co', 14.00, 22.00),
  ('io', 32.00, 48.00),
  ('app', 14.00, 22.00),
  ('dev', 12.00, 19.00);

-- Indices para mejorar performance
CREATE INDEX idx_dominios_cliente ON dominios(cliente_id);
CREATE INDEX idx_dominios_expiracion ON dominios(fecha_expiracion);
CREATE INDEX idx_dominios_estado ON dominios(estado);
CREATE INDEX idx_dominios_tld ON dominios(tld);
```

#### E. Endpoints de API a Crear

```javascript
// routes/domains.js
const express = require('express');
const router = express.Router();
const { checkDomainAvailability, checkMultipleDomains } = require('../services/domainService');
const { registerDomain } = require('../services/domainRegistrationService');
const { renewDomain } = require('../services/renewalService');
const { pool } = require('../db/pool');
const authMiddleware = require('../middleware/auth');

// GET /api/domains/check?domain=ejemplo.com
// GET /api/domains/check?name=ejemplo&tlds=com,co,com.co
// Publico (no requiere autenticacion)
router.get('/check', async (req, res) => {
  try {
    const { domain, name, tlds } = req.query;

    if (domain) {
      const result = await checkDomainAvailability(domain);
      return res.json({ success: true, data: result });
    }

    if (name) {
      const tldsArray = tlds ? tlds.split(',').map(t => `.${t}`) : ['.com', '.co', '.com.co', '.net'];
      const results = await checkMultipleDomains(name, tldsArray);
      return res.json({ success: true, data: results });
    }

    res.status(400).json({ success: false, error: 'Debes proporcionar domain o name' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/domains/register
// Requiere autenticacion y pago previo procesado
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { domain, period, owner, nameservers, precioVenta } = req.body;

    if (!domain || !owner) {
      return res.status(400).json({ success: false, error: 'Faltan datos requeridos' });
    }

    const result = await registerDomain({
      domain,
      period: period || 1,
      owner,
      nameservers,
      clienteId: req.user.id,
      precioVenta
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/domains/mis-dominios
// Listar dominios del cliente autenticado
router.get('/mis-dominios', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, estado } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT id, dominio, tld, fecha_registro, fecha_expiracion,
             auto_renew, estado, nameservers, privacy_protection
      FROM dominios
      WHERE cliente_id = $1
    `;
    const params = [req.user.id];

    if (estado) {
      query += ` AND estado = $${params.length + 1}`;
      params.push(estado);
    }

    query += ` ORDER BY fecha_expiracion ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const total = await pool.query(
      'SELECT COUNT(*) FROM dominios WHERE cliente_id = $1',
      [req.user.id]
    );

    res.json({
      success: true,
      data: result.rows,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: parseInt(total.rows[0].count) }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/domains/renovar/:id
router.post('/renovar/:id', authMiddleware, async (req, res) => {
  try {
    // Verificar que el dominio pertenece al cliente
    const dominio = await pool.query(
      'SELECT * FROM dominios WHERE id = $1 AND cliente_id = $2',
      [req.params.id, req.user.id]
    );

    if (!dominio.rows[0]) {
      return res.status(404).json({ success: false, error: 'Dominio no encontrado' });
    }

    const result = await renewDomain(parseInt(req.params.id));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/domains/info/:id
router.get('/info/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.nombre as cliente_nombre
       FROM dominios d
       JOIN clientes_cloud c ON d.cliente_id = c.id
       WHERE d.id = $1 AND d.cliente_id = $2`,
      [req.params.id, req.user.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ success: false, error: 'Dominio no encontrado' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

**Variables de entorno necesarias (.env):**

```bash
# Openprovider
OPENPROVIDER_USERNAME=tu_usuario
OPENPROVIDER_PASSWORD=tu_password
OPENPROVIDER_API_URL=https://api.openprovider.eu/v1beta
# Para pruebas usar: https://api.cte.openprovider.eu/v1beta

# Base de datos
DATABASE_URL=postgresql://usuario:password@localhost:5432/bigcloudmiami

# TRM (actualizar periodicamente o consumir API del Banco de la Republica)
USD_TO_COP_RATE=4200
```

---

### Fase 3: Frontend (Semana 5)

#### Buscador de dominios en landing page

El buscador debe:
1. Input de texto para el nombre del dominio (sin extension)
2. Boton "Buscar"
3. Hacer GET a `/api/domains/check?name=X&tlds=com,co,com.co,net,io`
4. Mostrar tabla de resultados con:
   - TLD disponible/no disponible (icono verde/rojo)
   - Precio en COP (convertir en frontend usando TRM del dia)
   - Boton "Agregar al carrito" para los disponibles

**Componente React sugerido:**

```jsx
// components/DomainSearch.jsx
import { useState } from 'react';

export function DomainSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `/api/domains/check?name=${encodeURIComponent(query)}&tlds=com,co,com.co,net,io`
      );
      const data = await res.json();
      setResults(data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="domain-search">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="nombre-de-tu-empresa"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar dominio'}
        </button>
      </form>

      {results.map(result => (
        <div key={result.domain} className={`result ${result.available ? 'available' : 'taken'}`}>
          <span>{result.domain}</span>
          <span>{result.available ? 'Disponible' : 'No disponible'}</span>
          {result.available && (
            <>
              <span>${result.price} USD/año</span>
              <button onClick={() => addToCart(result)}>Agregar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
```

#### Flujo de compra con Wompi

```
1. Cliente busca dominio → selecciona el que quiere
2. Va al checkout → ingresa datos de contacto/propietario del dominio
3. Pago con Wompi (tarjeta, PSE, Nequi, Bancolombia)
4. Webhook de Wompi confirma pago exitoso
5. Tu backend llama a registerDomain() automaticamente
6. Cliente recibe email de confirmacion con datos del dominio
```

**Endpoint webhook de Wompi:**
```javascript
// POST /api/webhooks/wompi
app.post('/api/webhooks/wompi', async (req, res) => {
  const { event, data } = req.body;

  if (event === 'transaction.updated' && data.transaction.status === 'APPROVED') {
    const metadata = data.transaction.metadata;
    // metadata debe contener: domain, period, owner, clienteId

    await registerDomain({
      domain: metadata.domain,
      period: parseInt(metadata.period),
      owner: JSON.parse(metadata.owner),
      clienteId: parseInt(metadata.clienteId),
      precioVenta: data.transaction.amount_in_cents / 100 // convertir de centavos
    });
  }

  res.status(200).json({ received: true });
});
```

---

### Fase 4: DNS Automatico con Technitium (Semana 6)

#### Configurar nameservers automaticamente al registrar dominio

```javascript
// services/technitiumService.js
// Asume que Technitium tiene la API HTTP habilitada

const axios = require('axios');

const TECHNITIUM_API = process.env.TECHNITIUM_API_URL || 'http://localhost:5380/api';
const TECHNITIUM_TOKEN = process.env.TECHNITIUM_API_TOKEN;

/**
 * Crear zona DNS para un dominio recien registrado
 * @param {string} domain - ej: "miempresa.com"
 * @param {string} template - 'hosting', 'vps', 'basic'
 */
async function createDomainZone(domain, template = 'basic') {
  // 1. Crear la zona primaria
  await axios.get(`${TECHNITIUM_API}/zones/create`, {
    params: {
      token: TECHNITIUM_TOKEN,
      zone: domain,
      type: 'Primary'
    }
  });

  // 2. Agregar registros segun template
  const records = getDnsTemplate(domain, template);

  for (const record of records) {
    await axios.get(`${TECHNITIUM_API}/zones/records/add`, {
      params: {
        token: TECHNITIUM_TOKEN,
        zone: domain,
        ...record
      }
    });
  }

  return { success: true, zone: domain };
}

function getDnsTemplate(domain, template) {
  const baseRecords = [
    // Registros SOA y NS se crean automaticamente por Technitium
    // Agregar registros basicos
    { domain: domain, type: 'A', ipAddress: '0.0.0.0', ttl: 300 },
    { domain: `www.${domain}`, type: 'CNAME', cname: domain, ttl: 300 }
  ];

  if (template === 'hosting') {
    return [
      ...baseRecords,
      // Apuntar a servidor de hosting de BigCloudMiami
      { domain: domain, type: 'A', ipAddress: process.env.HOSTING_SERVER_IP, ttl: 300 },
      { domain: `www.${domain}`, type: 'A', ipAddress: process.env.HOSTING_SERVER_IP, ttl: 300 },
      // MX records para email
      { domain: domain, type: 'MX', exchange: `mail.${domain}`, preference: 10, ttl: 300 }
    ];
  }

  if (template === 'vps') {
    // Solo zona en blanco, el cliente configura sus IPs
    return baseRecords;
  }

  return baseRecords;
}

module.exports = { createDomainZone };
```

**Nameservers a configurar en Openprovider al registrar dominios:**
- `ns1.bigcloudmiami.com` → IP de tu servidor DNS primario Technitium
- `ns2.bigcloudmiami.com` → IP de tu servidor DNS secundario (si tienes redundancia)

> Para que los clientes puedan usar tus nameservers, debes registrar los "glue records" (registros NS con IP) ante el registro del TLD correspondiente. Openprovider permite hacer esto desde su panel.

---

## 4. Consideraciones Legales en Colombia

### 4.1 Acreditacion ICANN

**Pregunta clave: ¿BigCloudMiami necesita acreditacion ICANN para revender dominios?**

**Respuesta: No.** Como revendedor de un registrador acreditado (Openprovider lo esta), operas bajo el paraguas legal de dicho registrador. Tu relacion es:

```
ICANN
  └── Openprovider (Registrador acreditado ICANN)
        └── BigCloudMiami (Revendedor)
              └── Clientes finales
```

La acreditacion ICANN directa solo es necesaria si quisieras convertirte en registrador acreditado independiente, lo que requiere:
- Pago de USD 4,000 de cuota de solicitud a ICANN
- Requisitos de capital minimo y sistemas tecnicos robustos
- Cumplimiento del Registrar Accreditation Agreement (RAA)

**Recomendacion:** No buscar acreditacion directa. El modelo reseller es mas que suficiente para el mercado colombiano de SMEs.

### 4.2 Proteccion de Datos - Ley 1581 de 2012

Como revendedor de dominios, recolectas datos personales sensibles de tus clientes (datos WHOIS del registrante). Obligaciones:

**Debes:**
- Tener una **Politica de Privacidad** publicada en tu sitio web que explique:
  - Que datos recolectas (nombre, email, telefono, direccion del registrante)
  - Para que los usas (registro del dominio ante ICANN/registrador)
  - Con quien los compartes (Openprovider, registros de TLD)
  - Derechos del titular (acceso, rectificacion, supresion)
- Registrar tu base de datos ante la **Superintendencia de Industria y Comercio (SIC)** si aun no lo has hecho para tu negocio general: https://www.sic.gov.co/registro-nacional-de-bases-de-datos
- Tener mecanismo para recibir solicitudes de habeas data (email designado)
- **NO** compartir datos WHOIS mas alla de lo requerido por el proceso de registro

**Nota RDAP/WHOIS:** Desde la implementacion de la politica de Temporary Specification de ICANN (2018+), los datos WHOIS de personas naturales estan protegidos. Openprovider maneja esto automaticamente, pero debes documentarlo en tu politica de privacidad.

### 4.3 Facturacion Electronica

Desde 2024, **todos los negocios en Colombia** que emitan facturas a personas juridicas deben usar facturacion electronica (Decreto 1165/2023 y Resolucion DIAN).

**Para dominos especificamente:**
- Si vendes a empresas (NIT): **obligatorio** emitir factura electronica
- Si vendes a personas naturales: depende de tu regimen tributario
- Los dominios son un **servicio digital**, sujeto al IVA del 19% si la venta es a empresas colombianas

**Opciones de software de facturacion electronica:**
- Alegra: https://www.alegra.com (popular en Colombia, ~$35,000 COP/mes)
- Siigo: https://www.siigo.com (integra con muchos sistemas)
- Factus (Amarillo): Opcion economica para volumen bajo

**Recomendacion:** Consultar con un contador colombiano sobre si los dominios vendidos a clientes del exterior estan exentos de IVA (exportacion de servicios - Art. 481 ET).

### 4.4 Responsabilidades como Revendedor

Debes informar claramente a tus clientes:

1. **Uso aceptable:** No puedes registrar dominios para phishing, spam, o violacion de marcas registradas
2. **Politica de disputa de dominio (UDRP):** Si un tercero reclama un dominio por violacion de marca, el proceso puede resultar en la transferencia del dominio. Esto esta fuera de tu control como revendedor
3. **Suspension por abuso:** ICANN puede ordenar la suspension de dominios usados para actividades maliciosas
4. **Documentar** en tus Terminos y Condiciones que eres revendedor y no el registrador final, limitando tu responsabilidad

**Documentos legales minimos a tener:**
- Terminos y Condiciones del servicio de dominios (diferente a hosting)
- Politica de Privacidad actualizada
- Politica de Reembolsos (ICANN exige politica clara de reembolso a nuevos registrantes)

---

## 5. Plan de Implementacion Recomendado

### Cronograma Detallado

#### Semana 1: Registro y documentacion legal
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun | Crear cuenta en Openprovider | Admin | Pendiente |
| Lun | Preparar documentos empresariales (Camara Comercio, cedula) | Admin | Pendiente |
| Mar | Subir documentos KYC a Openprovider | Admin | Pendiente |
| Mie | Hacer deposito inicial USD 100 (transferencia o tarjeta) | Admin/Financiero | Pendiente |
| Jue | Obtener y probar credenciales API en sandbox | Dev | Pendiente |
| Vie | Revisar documentacion API Openprovider, planificar integracion | Dev | Pendiente |

#### Semana 2: Configuracion DNS y estructura BD
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun | Registrar glue records ns1/ns2.bigcloudmiami.com | Admin | Pendiente |
| Mar | Crear estructura de base de datos (tablas dominios, historial, precios_tld) | Dev | Pendiente |
| Mie | Configurar variables de entorno en servidor de produccion | Dev | Pendiente |
| Jue | Preparar Terminos y Condiciones del servicio de dominios | Legal/Admin | Pendiente |
| Vie | Configurar facturacion electronica para servicio digital | Admin/Contador | Pendiente |

#### Semana 3: Integracion API - Core
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun-Mar | Implementar autenticacion y servicio de disponibilidad | Dev | Pendiente |
| Mie-Jue | Implementar registro de dominio (con pruebas en sandbox) | Dev | Pendiente |
| Vie | Pruebas de registro real (usar dominio de prueba, costo ~$8.57) | Dev | Pendiente |

#### Semana 4: Integracion API - Gestion
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun-Mar | Implementar endpoints GET mis-dominios, info/:id | Dev | Pendiente |
| Mie | Implementar renovacion manual y automatica (cron) | Dev | Pendiente |
| Jue-Vie | Implementar integracion con Technitium para zonas DNS automaticas | Dev | Pendiente |

#### Semana 5: Frontend y pagos
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun-Mar | Buscador de dominios en landing page | Dev/Diseño | Pendiente |
| Mar-Mie | Panel de gestion de dominios en dashboard cliente | Dev | Pendiente |
| Jue-Vie | Integracion Wompi + webhook para registro automatico post-pago | Dev | Pendiente |

#### Semana 6: Testing, launch y marketing
| Dia | Actividad | Responsable | Estado |
|-----|-----------|-------------|--------|
| Lun-Mar | Testing end-to-end: buscar, pagar, registrar, ver en panel | Dev/QA | Pendiente |
| Mie | Configurar alertas de monitoreo (dominios proximos a vencer) | Dev | Pendiente |
| Jue | Launch soft: anunciar a clientes existentes de hosting/VPS | Marketing | Pendiente |
| Vie | Documentar proceso para soporte al cliente | Admin | Pendiente |

---

### Hitos y Criterios de Exito

| Hito | Semana | Criterio de exito |
|------|--------|-------------------|
| Cuenta reseller activa | 1 | Login exitoso en Openprovider, credenciales API funcionando en sandbox |
| BD y DNS listos | 2 | Migracion de tablas aplicada, ns1/ns2 respondiendo |
| Primer dominio de prueba registrado | 3 | Dominio real registrado via API, visible en panel Openprovider |
| Flujo completo funcional | 5 | Cliente puede buscar, pagar con Wompi y ver su dominio en dashboard |
| Primer cliente externo | 6 | Al menos 3 dominios vendidos a clientes reales |
| Break-even del desarrollo | 3-4 meses | Margen acumulado cubre inversion inicial |

---

### Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|-------------|---------|-----------|
| Rechazo de KYC por Openprovider | Baja | Alto | Preparar todos los documentos antes de aplicar; tener Hexonet como alternativa |
| Demora en transferencia bancaria internacional | Media | Medio | Usar tarjeta de credito para el deposito inicial; transferencia para recargas futuras |
| Fallo de renovacion automatica | Media | Alto | Monitoreo diario del cron job; alertas por email/Slack cuando falla; buffers de 30 dias |
| Cliente disputa de dominio por marca | Baja | Medio | Clausula en T&C limitando responsabilidad; proceso claro de UDRP para clientes |
| Cambio de precios por Openprovider | Media | Medio | Revisar precios mensualmente; ajustar tabla precios_tld; margen del 40%+ absorbe variaciones |
| Downtime del servidor DNS | Baja | Alto | Configurar DNS secundario (al menos un slave de Technitium en otro servidor) |

---

## 6. Estimacion de Esfuerzo de Desarrollo

### Desglose por Componente

| Componente | Horas estimadas | Complejidad | Notas |
|-----------|-----------------|-------------|-------|
| Integracion API Openprovider (check, register, renew) | 16–24h | Media | La documentacion es buena; el sandbox acelera el desarrollo |
| Modelos BD y migraciones | 4–6h | Baja | Esquema relativamente sencillo |
| Endpoints REST Node.js | 12–16h | Media | 5 endpoints + middlewares |
| Cron job renovaciones automaticas | 4–6h | Baja | Logica directa, integrar con sistema de notificaciones existente |
| Integracion Technitium DNS | 8–12h | Media-Alta | Depende de version y config existente de Technitium |
| Frontend - Buscador de dominios | 8–12h | Media | Componente React/Vue interactivo |
| Frontend - Panel gestion dominios | 12–16h | Media | Tabla con acciones, estados, fechas |
| Integracion Wompi + webhook | 8–12h | Media | Si ya tienen Wompi integrado para otros servicios, reduce a 4–6h |
| Testing y QA end-to-end | 8–12h | Media | Incluye pruebas con dominios reales ($~25 en pruebas) |
| Documentacion interna y soporte | 4–6h | Baja | Guia para el equipo de soporte |
| **TOTAL** | **84–122 horas** | | |

### Escenarios de Implementacion

#### Opcion A: Desarrollo interno (mas recomendada)

**Perfil necesario:** Desarrollador Node.js con experiencia en integraciones API REST y PostgreSQL.

| Item | Costo |
|------|-------|
| Horas desarrollo (84–122h) a $25–35 USD/h | $2,100–$4,270 USD |
| Dominios de prueba (~3) | ~$25 USD |
| Deposito inicial Openprovider | $100 USD |
| **Total** | **$2,225–$4,395 USD** |

**Ventajas:** El equipo entiende el codigo, facil de mantener y extender, no hay dependencia de terceros.

#### Opcion B: Usar modulo WHMCS Domain Registrar

Si ya tienen WHMCS o planean adoptarlo:
- Openprovider tiene modulo oficial para WHMCS: https://docs.openprovider.com/whmcs
- Hexonet tambien tiene modulo WHMCS: https://github.com/hexonet/whmcs-ispapi-registrar
- El modulo reduce el desarrollo propio a ~20h (configuracion, personalizacion)
- WHMCS costo: ~$15.95 USD/mes o licencia perpetua ~$299 USD

**Recomendacion para BigCloudMiami:** Dado que ya tienen stack propio en Node.js, la **Opcion A** es mas coherente y rentable a largo plazo.

#### Opcion C: Contratar desarrollo externo

Si no hay recursos internos disponibles:
- Freelancer colombiano Node.js: $15–25 USD/h → Total: $1,260–$3,050 USD
- Plataformas: Workana (https://www.workana.com), Freelancer, Toptal
- Tiempo estimado con freelancer dedicado: 3–4 semanas

---

### Resumen de Inversion Total Recomendada

| Concepto | Minimo (USD) | Optimo (USD) |
|----------|-------------|-------------|
| Deposito inicial Openprovider | $100 | $200 |
| Desarrollo (interno, 84h) | $2,100 | $3,000 |
| Dominios de prueba | $25 | $50 |
| Facturacion electronica (6 meses) | $0* | $210 |
| Consultoria legal (T&C + privacidad) | $0* | $300 |
| **TOTAL** | **~$2,225** | **~$3,760** |

> *Si se redactan internamente usando plantillas. Recomendado consultar con abogado para los T&C.

**Tiempo de retorno de inversion (ROI):**
- Escenario conservador: ~12 meses
- Escenario moderado: ~3–4 meses
- Escenario optimista: ~2 meses

---

## Recursos y Referencias

### Documentacion de Proveedores
- Openprovider API Docs: https://docs.openprovider.com
- Openprovider API Reference: https://api.openprovider.eu/v1beta/
- Hexonet Node.js SDK: https://github.com/hexonet/node-sdk
- Namecheap API Docs: https://www.namecheap.com/support/api/intro/
- ResellerClub API: https://manage.resellerclub.com/kb/answer/744

### Regulaciones y Compliance
- ICANN Registrar Accreditation: https://www.icann.org/resources/pages/registrars/accreditation-en
- ICANN RDAP/WHOIS Policy: https://www.icann.org/rdap
- Ley 1581 de 2012 (Colombia): https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981
- Registro SIC bases de datos: https://www.sic.gov.co/registro-nacional-de-bases-de-datos
- UDRP Policy: https://www.icann.org/resources/pages/udrp-policy-2012-02-25-en

### Herramientas Utiles
- Technitium DNS API: https://technitium.com/dns/help.html#api
- Wompi API Colombia: https://docs.wompi.co
- TRM oficial Colombia (Banco Republica): https://www.banrep.gov.co/es/estadisticas/trm
- WHOIS Lookup: https://lookup.icann.org

---

*Documento elaborado para BigCloudMiami | Version 1.0 | Marzo 2026*
*Precios y condiciones sujetos a cambios. Verificar siempre con el proveedor antes de tomar decisiones.*
