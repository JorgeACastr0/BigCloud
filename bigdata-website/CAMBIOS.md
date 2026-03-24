# Actualización Completada - BigData.net.co

## ✅ Cambios Realizados

### 1. Hero Section
- **Título**: "Internet de Alta Velocidad **en Cajicá**"
- **Subtítulo**: Proveedor ISP con fibra óptica + Desarrollo de aplicaciones + Automatizaciones con n8n + IoT con Node-RED + Inteligencia Artificial + Home Assistant
- **Botones**: "Solicitar Servicio" y "Ver Planes"

### 2. Servicios Actualizados (6 servicios modernos)

1. **🌐 Internet ISP - Fibra Óptica**
   - Proveedor de internet de alta velocidad en Cajicá
   - Fibra óptica con planes residenciales y empresariales
   - Soporte técnico 24/7 y garantía de uptime

2. **📱 Desarrollo de Aplicaciones**
   - Aplicaciones web y móviles modernas
   - Sistemas a medida con las últimas tecnologías
   - Integración con APIs y servicios en la nube

3. **⚙️ Automatizaciones con n8n**
   - Workflows automatizados para tu negocio
   - Integración de sistemas y procesos empresariales
   - Ahorra tiempo con automatizaciones inteligentes

4. **🔌 IoT con Node-RED**
   - Soluciones de Internet de las Cosas
   - Monitoreo y control remoto de dispositivos
   - Automatización industrial y domótica

5. **🤖 Inteligencia Artificial**
   - Implementación de IA en procesos empresariales
   - Chatbots, asistentes virtuales y análisis predictivo
   - Automatiza con IA

6. **🏠 Home Assistant**
   - Domótica y casas inteligentes
   - Automatización del hogar con control centralizado
   - Integra todos tus dispositivos smart

### 3. Tecnologías que Utilizamos

- **🔧 n8n Workflow Automation** - Plataforma de automatización de workflows
- **🔌 Node-RED** - Herramienta de programación visual para IoT
- **🏠 Home Assistant** - Plataforma open-source para automatización del hogar
- **🤖 IA & Machine Learning** - ChatGPT, Claude, y otras herramientas de IA generativa
- **🌐 Fibra Óptica GPON** - Tecnología FTTH con velocidades de hasta 1Gbps
- **📊 Bases de Datos Modernas** - MySQL, PostgreSQL, MongoDB y Redis

### 4. Información de Contacto Actualizada

- **📧 Email**: contacto@bigdata.net.co
- **📱 Soporte Técnico**: 300 216 34 60
- **💬 WhatsApp**: [301 719 60 89](https://wa.me/573017196089) (clickeable)
- **📍 Ubicación**: Cll 2 6-31 Casa 2, Cajicá, Cundinamarca

### 5. Sobre Nosotros - Actualizado

- Desde 1991 en el sector tecnológico
- Hoy: Proveedor ISP de internet de alta velocidad en Cajicá con fibra óptica
- Combinamos 30+ años de experiencia con tecnologías modernas
- Desarrollo de aplicaciones, automatizaciones con n8n, IoT con Node-RED, IA y Home Assistant

### 6. Características Destacadas

✅ Proveedor ISP con fibra óptica en Cajicá
✅ Expertos en automatizaciones e IoT
✅ Soporte técnico 24/7 los 365 días del año

## 📸 Fotos Disponibles

Las siguientes fotos están listas en `src/assets/images/`:
- Screenshot 2025-12-31 7.44.11 AM.png
- 80d88413-cf09-4d57-a9d8-ea7d16d3cc5d.jpeg
- 0afb591f-13bb-448c-bd20-13bfda0c7354.jpeg
- e367b302-a536-4fde-8ab3-4380595fd6f8.jpeg
- b241b93e-42d8-42d7-ad99-5758f65960ce.jpeg
- df0ca276-5eca-469f-ba17-2edcddf89328.jpeg
- 6e8e45ef-ad7a-4105-afe7-ef33ce58e5cb.jpeg
- 4927402227224655664.jpg
- 4927402227224655660.jpg
- 5157169603032493737.jpg

## 🌐 Sitio Web

El sitio está corriendo en: **http://localhost:8000**

## 📋 Próximos Pasos Opcionales

1. **Agregar galería de proyectos** - Mostrar las fotos de instalaciones reales
2. **Optimizar imágenes** - Renombrar con nombres descriptivos
3. **Agregar planes de internet** - Crear sección con precios y velocidades
4. **Preparar para despliegue** - Crear imagen Docker y subir al VPS

## 🚀 Para Desplegar al VPS

```bash
# 1. Construir imagen Docker
cd /home/jorgecastro/.gemini/antigravity/scratch/bigdata-website
docker build -t bigdata-website:latest .

# 2. Guardar imagen
docker save bigdata-website:latest | gzip > bigdata-website.tar.gz

# 3. Transferir al VPS
scp bigdata-website.tar.gz user@tu-vps-ip:/tmp/

# 4. En el VPS, cargar y ejecutar
ssh user@tu-vps-ip
docker load < /tmp/bigdata-website.tar.gz
docker run -d -p 80:80 --name bigdata-web bigdata-website:latest
```

---

**¡Sitio web actualizado y listo!** 🎉
