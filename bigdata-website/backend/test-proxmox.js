/**
 * Script de prueba para verificar conexión con Proxmox
 * Ejecutar: node test-proxmox.js
 */

const axios = require('axios');
const https = require('https');

// Configuración de Proxmox
const PROXMOX_HOST = '201.184.49.203';
const PROXMOX_PORT = 8006;
const PROXMOX_NODE = 'servidor1';
const TOKEN_USER = 'api-user@pve';
const TOKEN_ID = 'mi-token';
const TOKEN_SECRET = '45c74305-e052-4b6d-a842-4a40b3571441';

// Cliente HTTP
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

async function testProxmox() {
    console.log('🔍 PRUEBA DE CONEXIÓN PROXMOX API\n');
    console.log('═'.repeat(60));

    try {
        // 1. Probar versión (verifica conectividad básica)
        console.log('\n1️⃣ Probando conectividad...');
        const versionRes = await client.get('/version');
        console.log('✅ Conectado a Proxmox VE', versionRes.data.data.version);

        // 2. Listar todos los contenedores LXC
        console.log('\n2️⃣ Listando contenedores LXC...');
        const lxcRes = await client.get(`/nodes/${PROXMOX_NODE}/lxc`);
        const containers = lxcRes.data.data;

        if (containers.length === 0) {
            console.log('⚠️  No hay contenedores LXC en el servidor');
        } else {
            console.log(`✅ Encontrados ${containers.length} contenedores:\n`);

            for (const ct of containers) {
                console.log(`   📦 VMID: ${ct.vmid}`);
                console.log(`      Nombre: ${ct.name}`);
                console.log(`      Estado: ${ct.status}`);
                console.log(`      CPU: ${ct.cpus || 'N/A'} cores`);
                console.log(`      RAM: ${ct.maxmem ? (ct.maxmem / 1024 / 1024).toFixed(0) + ' MB' : 'N/A'}`);
                console.log(`      Disco: ${ct.maxdisk ? (ct.maxdisk / 1024 / 1024 / 1024).toFixed(1) + ' GB' : 'N/A'}`);
                console.log(`      Uptime: ${ct.uptime ? Math.floor(ct.uptime / 60) + ' min' : 'Detenido'}`);
                console.log('');
            }
        }

        // 3. Listar VMs (KVM)
        console.log('3️⃣ Listando máquinas virtuales (KVM)...');
        const kvmRes = await client.get(`/nodes/${PROXMOX_NODE}/qemu`);
        const vms = kvmRes.data.data;

        if (vms.length === 0) {
            console.log('⚠️  No hay VMs KVM en el servidor');
        } else {
            console.log(`✅ Encontradas ${vms.length} VMs:\n`);

            for (const vm of vms) {
                console.log(`   🖥️  VMID: ${vm.vmid}`);
                console.log(`      Nombre: ${vm.name}`);
                console.log(`      Estado: ${vm.status}`);
                console.log('');
            }
        }

        // 4. Obtener siguiente VMID disponible
        console.log('4️⃣ Obteniendo siguiente VMID disponible...');
        const nextIdRes = await client.get('/cluster/nextid');
        console.log(`✅ Próximo VMID: ${nextIdRes.data.data}`);

        // 5. Verificar templates disponibles
        console.log('\n5️⃣ Verificando templates disponibles...');
        const templatesRes = await client.get(`/nodes/${PROXMOX_NODE}/storage/local/content`);
        const templates = templatesRes.data.data.filter(t => t.content === 'vztmpl');

        if (templates.length === 0) {
            console.log('⚠️  No hay templates LXC descargados');
        } else {
            console.log(`✅ Templates disponibles:\n`);
            templates.forEach(t => {
                console.log(`   📄 ${t.volid.split('/')[1]}`);
            });
        }

        console.log('\n' + '═'.repeat(60));
        console.log('✅ TODAS LAS PRUEBAS EXITOSAS\n');

        // Resumen
        console.log('📊 RESUMEN:');
        console.log(`   • Contenedores LXC: ${containers.length}`);
        console.log(`   • VMs KVM: ${vms.length}`);
        console.log(`   • Próximo VMID: ${nextIdRes.data.data}`);
        console.log(`   • Templates: ${templates.length}`);
        console.log('');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.error('   → No se puede conectar a Proxmox');
            console.error('   → Verifica que el firewall permita la IP del VPS Miami');
        } else if (error.response?.status === 401) {
            console.error('   → Error de autenticación');
            console.error('   → Verifica el token API');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('   → Timeout de conexión');
            console.error('   → Verifica la conectividad de red');
        }

        console.error('\n   Detalles:', error.response?.data || error.code);
    }
}

// Ejecutar prueba
testProxmox();
