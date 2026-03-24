# Guía: Cómo descargar Templates "Interesantes" en Proxmox

Para que tu nube sea más atractiva, puedes ofrecer contenedores con aplicaciones pre-instaladas (WordPress, Base de Datos, Panel de Control, etc.) usando los templates de **TurnKey Linux**.

## 1. Actualizar la lista de templates oficiales
Ejecuta esto en la terminal de tu Proxmox (el nodo `servidor1`):
```bash
pveam update
```

## 2. Buscar templates interesantes
Puedes ver la lista completa con:
```bash
pveam available
```

## 3. Descargar los recomendados
Usa el nombre del template tal cual aparece en la columna derecha de `pveam available`. **Sin prefijos**.

### Aplicaciones (TurnKey):
```bash
# WordPress (Sitios web listos)
pveam download local debian-12-turnkey-wordpress_18.2-1_amd64.tar.gz

# MySQL/MariaDB (Bases de datos)
pveam download local debian-12-turnkey-mysql_18.1-1_amd64.tar.gz

# Nextcloud (Nube privada)
pveam download local debian-12-turnkey-nextcloud_18.1-1_amd64.tar.gz
```

> [!IMPORTANT]
> Si estos fallan, copia exactamente el texto de la derecha que te salió en `pveam available`.

## 4. ¿Cómo aparecerán en el Dashboard?
He actualizado el backend para que cada vez que descargues uno nuevo, el Dashboard lo liste automáticamente al crear un VPS. ¡Es tiempo real! 🚀
