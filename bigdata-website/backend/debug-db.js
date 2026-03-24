/**
 * Script de diagnóstico de Base de Datos para el backend
 * Ejecutar en el VPS: node backend/debug-db.js
 */

const { Pool } = require('pg');

const pool = new Pool({
    host: 'postgres-shared',
    port: 5432,
    database: 'bigdata_isp_v2',
    user: 'admin',
    password: 'BigData_Postgres_2025_Secure!'
});

async function debugDB() {
    console.log('🔍 DIAGNÓSTICO DE BASE DE DATOS\n');

    try {
        // 1. Probar conexión
        const time = await pool.query('SELECT NOW()');
        console.log('✅ Conexión exitosa a PostgreSQL:', time.rows[0].now);

        // 2. Verificar Clientes
        const clientes = await pool.query('SELECT id, email FROM clientes_cloud');
        console.log(`👥 Clientes encontrados: ${clientes.rows.length}`);
        clientes.rows.forEach(c => console.log(`   - ID: ${c.id}, Email: ${c.email}`));

        // 3. Verificar Planes
        const planes = await pool.query('SELECT plan_id, nombre, activo FROM planes_cloud');
        console.log(`\n📋 Planes encontrados: ${planes.rows.length}`);
        planes.rows.forEach(p => console.log(`   - ID: ${p.plan_id}, Nombre: ${p.nombre}, Activo: ${p.activo}`));

        // 4. Verificar Instancias
        const instancias = await pool.query('SELECT instancia_id, hostname, cliente_cloud_id FROM instancias_vps');
        console.log(`\n🖥️  Instancias encontradas: ${instancias.rows.length}`);
        instancias.rows.forEach(i => console.log(`   - ID: ${i.instancia_id}, Hostname: ${i.hostname}, Cliente_ID: ${i.cliente_cloud_id}`));

        // 5. Verificar relación (Lo que el Dashboard debería mostrar)
        const misInstancias = await pool.query(`
      SELECT i.hostname, c.email 
      FROM instancias_vps i 
      JOIN clientes_cloud c ON i.cliente_cloud_id = c.id
    `);
        console.log(`\n🔗 Relaciones Cliente-Instancia: ${misInstancias.rows.length}`);
        misInstancias.rows.forEach(m => console.log(`   - VPS: ${m.hostname} -> Dueño: ${m.email}`));

        process.exit(0);
    } catch (err) {
        console.error('\n❌ ERROR DE DIAGNÓSTICO:', err.message);
        process.exit(1);
    }
}

debugDB();
