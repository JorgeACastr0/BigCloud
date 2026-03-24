/**
 * Script para obtener IPs de los VPS en Proxmox
 * Ejecutar: node get-vps-ips.js
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

async function getVPSIPs() {
    console.log('🔍 OBTENIENDO IPs DE VPS EN PROXMOX\n');
    console.log('═'.repeat(60));

    try {
        // Listar contenedores
        const lxcRes = await client.get(`/nodes/${PROXMOX_NODE}/lxc`);
        const containers = lxcRes.data.data;

        console.log('\n📋 VPS DETECTADOS:\n');

        for (const ct of containers) {
            console.log(`📦 VMID ${ct.vmid}: ${ct.name}`);
            console.log(`   Estado: ${ct.status}`);

            if (ct.status === 'running') {
                try {
                    // Obtener configuración de red
                    const configRes = await client.get(`/nodes/${PROXMOX_NODE}/lxc/${ct.vmid}/config`);
                    const config = configRes.data.data;

                    // Obtener interfaces de red
                    const interfacesRes = await client.get(`/nodes/${PROXMOX_NODE}/lxc/${ct.vmid}/interfaces`);
                    const interfaces = interfacesRes.data.data;

                    // Buscar IP en eth0
                    const eth0 = interfaces.find(iface => iface.name === 'eth0');

                    if (eth0 && eth0.inet) {
                        console.log(`   IP: ${eth0.inet}`);
                    } else if (eth0 && eth0.inet6) {
                        console.log(`   IPv6: ${eth0.inet6}`);
                    } else {
                        console.log(`   IP: No asignada (DHCP pendiente)`);
                    }

                    // Mostrar configuración de red
                    if (config.net0) {
                        console.log(`   Config: ${config.net0}`);
                    }

                } catch (error) {
                    console.log(`   ⚠️  No se pudo obtener IP: ${error.message}`);
                }
            } else {
                console.log(`   IP: VPS detenido`);
            }

            console.log('');
        }

        console.log('═'.repeat(60));
        console.log('\n💡 COMANDOS PARA OBTENER IPs MANUALMENTE:\n');

        for (const ct of containers) {
            if (ct.status === 'running') {
                console.log(`# VMID ${ct.vmid} (${ct.name})`);
                console.log(`pct exec ${ct.vmid} -- ip addr show eth0 | grep "inet "`);
                console.log('');
            }
        }

        console.log('\n📝 SQL PARA ACTUALIZAR IPs:\n');
        console.log('-- Ejecutar después de obtener las IPs reales');
        for (const ct of containers) {
            console.log(`UPDATE instancias_vps SET ip_publica = 'IP_AQUI' WHERE proxmox_vmid = ${ct.vmid};`);
        }

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    }
}

getVPSIPs();
