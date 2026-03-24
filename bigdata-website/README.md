# BigData.net.co - Website Redesign

Sitio web profesional y moderno para BigData.net.co con enfoque en ingeniería y tecnología.

## Estructura del Proyecto

```
bigdata-website/
├── src/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── main.js
│   └── assets/
│       └── images/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Desarrollo Local

### Opción 1: Servidor HTTP Simple (Python)
```bash
cd src
python3 -m http.server 8000
```

### Opción 2: Con Docker
```bash
docker-compose up
```

## Despliegue al VPS

```bash
# Construir imagen
docker build -t bigdata-website .

# Subir al VPS
docker save bigdata-website | ssh user@vps 'docker load'
```

## Tecnologías

- HTML5
- CSS3 (con diseño moderno y responsivo)
- JavaScript (Vanilla)
- Docker para despliegue
