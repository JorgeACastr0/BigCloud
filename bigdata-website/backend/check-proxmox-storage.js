/**
 * Script para explorar el almacenamiento de Proxmox (ISOs, Templates, Backups)
 * Ejecutar: node check-proxmox-storage.js
 */

const axios = require('axios');
const https = require('https');

const PROXMOX_HOST = '201.184.49.203';
const PROXMOX_PORT = 8006;
const PROXMOX_NODE = 'servidor1';
const TOKEN_USER = 'api-user@pve';
const TOKEN_ID = 'mi-token';
const TOKEN_SECRET = '45c74305-e052-4b6d-a842-4a40b3571441';

const client = axios.create({
    baseURL: `https://${PROXMOX_HOST}:${PROXMOX_PORT}/api2/json`,
    headers: {
        'Authorization': `PVEAPIToken=${TOKEN_USER}!${TOKEN_ID}=${TOKEN_SECRET}`
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        family: 4
    }),
    timeout: 30000
});

async function checkStorage() {
    console.log('🔍 EXPLORANDO ALMACENAMIENTO PROXMOX\n');
    console.log('═'.repeat(60));

    try {
        // 1. Listar almacenamientos disponibles
        const storageRes = await client.get(`/nodes/${PROXMOX_NODE}/storage`);
        const storages = storageRes.data.data;

        console.log(`\n📦 Almacenamientos encontrados: ${storages.length}\n`);

        for (const storage of storages) {
            console.log(`📂 Storage: ${storage.storage}`);
            console.log(`   Tipo: ${storage.type}`);
            console.log(`   Contenido: ${storage.content}`);
            console.log(`   Uso: ${(storage.used / 1024 / 1024 / 1024).toFixed(2)} GB / ${(storage.total / 1024 / 1024 / 1024).toFixed(2)} GB`);

            try {
                // 2. Listar contenido de cada storage
                const contentRes = await client.get(`/nodes/${PROXMOX_NODE}/storage/${storage.storage}/content`);
                const contents = contentRes.data.data;

                if (contents.length === 0) {
                    console.log('   ⚠️ No hay archivos en este storage');
                } else {
                    console.log(`   📄 Archivos (${contents.length}):`);

                    // Agrupar por tipo
                    const isos = contents.filter(c => c.content === 'iso');
                    const templates = contents.filter(c => c.content === 'vztmpl');
                    const backups = contents.filter(c => c.content === 'backup');
                    const snippets = contents.filter(c => c.content === 'snippets');

                    if (isos.length > 0) {
                        console.log('\n      💿 ISOs (Imágenes de disco):');
                        isos.forEach(i => console.log(`         - ${i.volid.split('/').pop()} (${(i.size / 1024 / 1024).toFixed(0)} MB)`));
                    }

                    if (templates.length > 0) {
                        console.log('\n      📦 LXC Templates:');
                        templates.forEach(t => console.log(`         - ${t.volid.split('/').pop()}`));
                    }

                    if (backups.length > 0) {
                        console.log('\n      💾 Backups:');
                        backups.forEach(b => console.log(`         - ${b.volid.split('/').pop()} (${(b.size / 1024 / 1024).toFixed(0)} MB)`));
                    }

                    if (snippets.length > 0) {
                        console.log('\n      📝 Snippets/Scripts:');
                        snippets.forEach(s => console.log(`         - ${s.volid.split('/').pop()}`));
                    }
                }
            } catch (e) {
                console.log(`   ❌ No se pudo leer el contenido: ${e.message}`);
            }
            console.log('\n' + '─'.repeat(40));
        }

        console.log('\n' + '═'.repeat(60));
        console.log('✅ EXPLORACIÓN COMPLETADA\n');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    }
}

checkStorage();
