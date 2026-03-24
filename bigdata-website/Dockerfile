FROM nginx:alpine

# Copiar archivos del sitio web
COPY src/ /usr/share/nginx/html/

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]
