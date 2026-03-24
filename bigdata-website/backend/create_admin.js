require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    host: 'postgres-shared',
    port: 5432,
    database: 'bigdata_isp_v2',
    user: 'admin',
    password: process.env.POSTGRES_PASSWORD || 'BigData_Postgres_2025_Secure!'
});

async function createAdmin() {
    const email = 'test@bigdata.net.co';
    const plainPassword = '123456'; // La misma que usabas antes
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    console.log(`🔐 Generando usuario Admin: ${email}`);

    try {
        // Verificar si existe
        const check = await pool.query('SELECT id FROM clientes_cloud WHERE email = $1', [email]);

        if (check.rows.length > 0) {
            // Actualizar password
            await pool.query(
                'UPDATE clientes_cloud SET password_hash = $1, nombre = $2, estado_verificacion = $3 WHERE email = $4',
                [hashedPassword, 'Usuario Test', 'VERIFICADO', email]
            );
            console.log('✅ Usuario actualizado correctamente.');
        } else {
            // Crear nuevo
            await pool.query(
                `INSERT INTO clientes_cloud (
            email, password_hash, nombre, apellido, telefono, 
            estado_verificacion, estado, saldo_creditos
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, 0)`,
                [hashedPassword, hashedPassword, 'Usuario Test', 'Admin', '3000000000', 'VERIFICADO', 'ACTIVO']
            );
            // Nota: Inserto el hash en password_hash. En server.js/server.js se espera password_hash O se mapea.
            // Mi cambio en user.js mapeaba user.password = user.password_hash.
            console.log('✅ Usuario creado correctamente.');
        }
    } catch (err) {
        console.error('❌ Error:', err);
    } finally {
        pool.end();
    }
}

createAdmin();

