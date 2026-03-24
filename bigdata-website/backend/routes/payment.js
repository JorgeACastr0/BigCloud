require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const auth = require('../middleware/auth');
const wompi = require('../services/wompi');

const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'postgres-shared',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    database: process.env.POSTGRES_DB || 'bigdata_isp_v2',
    user: process.env.POSTGRES_USER || 'admin',
    password: process.env.POSTGRES_PASSWORD
});

/**
 * POST /api/payment/iniciar
 * Inicia un pago en Wompi para un plan específico
 * Requiere autenticación
 */
router.post('/iniciar', auth, async (req, res) => {
    const { plan_id } = req.body;

    if (!plan_id) {
        return res.status(400).json({ error: 'plan_id requerido' });
    }

    try {
        // 1. Obtener datos del cliente
        const userResult = await pool.query(
            'SELECT id FROM clientes_cloud WHERE email = $1',
            [req.user.email]
        );
        if (!userResult.rows[0]) {
            return res.status(400).json({ error: 'Usuario no tiene cuenta Cloud' });
        }
        const cliente_cloud_id = userResult.rows[0].id;

        // 2. Obtener plan
        const planResult = await pool.query(
            'SELECT * FROM planes_cloud WHERE plan_id = $1 AND activo = true',
            [parseInt(plan_id)]
        );
        if (planResult.rows.length === 0) {
            return res.status(404).json({ error: 'Plan no encontrado' });
        }
        const plan = planResult.rows[0];

        // 3. Generar referencia única
        const reference = `BCM-${cliente_cloud_id}-${Date.now()}`;

        // 4. Calcular monto en centavos COP
        const amountInCents = wompi.usdToCopCents(parseFloat(plan.precio_mensual));

        // 5. Generar firma de integridad
        const signature = wompi.generateIntegritySignature(reference, amountInCents, 'COP');

        // 6. Guardar pago pendiente en BD
        await pool.query(`
            INSERT INTO pagos_pendientes (reference, cliente_cloud_id, plan_id, monto_usd, monto_cop, estado)
            VALUES ($1, $2, $3, $4, $5, 'pendiente')
            ON CONFLICT (reference) DO NOTHING
        `, [reference, cliente_cloud_id, plan.plan_id, plan.precio_mensual, amountInCents]);

        // 7. Construir URL del checkout de Wompi
        const publicKey = process.env.WOMPI_PUBLIC_KEY;
        const redirectUrl = process.env.NODE_ENV === 'production'
            ? `https://ww2.bigdata.net.co/dashboard/?pago=exitoso&ref=${reference}`
            : `http://localhost:3006/dashboard/?pago=exitoso&ref=${reference}`;

        const wompiCheckoutUrl = `https://checkout.wompi.co/p/?` + new URLSearchParams({
            'public-key': publicKey,
            currency: 'COP',
            'amount-in-cents': amountInCents,
            reference: reference,
            'signature:integrity': signature,
            'redirect-url': redirectUrl
        }).toString();

        res.json({
            success: true,
            reference,
            publicKey,
            amountInCents,
            currency: 'COP',
            signature,
            redirectUrl,
            wompiCheckoutUrl,
            plan: {
                nombre: plan.nombre,
                tipo: plan.tipo,
                precio_usd: plan.precio_mensual
            }
        });

    } catch (err) {
        console.error('❌ Error iniciando pago:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * POST /api/payment/webhook
 * Recibe notificaciones de Wompi sobre el estado de los pagos
 * NO requiere autenticación (llamado por Wompi)
 * Siempre retorna 200 para evitar reintentos
 */
router.post('/webhook', async (req, res) => {
    // Responder 200 inmediatamente para Wompi
    res.status(200).json({ received: true });

    try {
        const event = req.body;
        const checksumHeader = req.headers['x-event-checksum'];

        console.log('📬 Webhook Wompi recibido:', event?.event, event?.data?.transaction?.id);

        // Verificar firma (en producción esto es crítico)
        if (process.env.NODE_ENV === 'production') {
            const isValid = wompi.verifyWebhookSignature(event, checksumHeader);
            if (!isValid) {
                console.error('❌ Firma de webhook inválida');
                return;
            }
        }

        // Solo procesar eventos de transacciones actualizadas
        if (event?.event !== 'transaction.updated') return;

        const transaction = event.data?.transaction;
        if (!transaction) return;

        const reference = transaction.reference;
        const status = transaction.status; // APPROVED, DECLINED, VOIDED, ERROR
        const transactionId = transaction.id;

        console.log(`💳 Pago ${reference}: ${status}`);

        // Actualizar estado en BD
        await pool.query(`
            UPDATE pagos_pendientes
            SET estado = $1, wompi_transaction_id = $2, wompi_status = $3
            WHERE reference = $4
        `, [
            status === 'APPROVED' ? 'aprobado' : 'rechazado',
            transactionId,
            status,
            reference
        ]);

        // Si fue aprobado, activar la instancia si existe
        if (status === 'APPROVED') {
            const pagoResult = await pool.query(
                'SELECT * FROM pagos_pendientes WHERE reference = $1',
                [reference]
            );

            if (pagoResult.rows[0]?.instancia_id) {
                await pool.query(
                    "UPDATE instancias_vps SET estado = 'RUNNING' WHERE instancia_id = $1",
                    [pagoResult.rows[0].instancia_id]
                );
                console.log(`✅ Instancia ${pagoResult.rows[0].instancia_id} activada por pago ${reference}`);
            }
        }

    } catch (err) {
        console.error('❌ Error procesando webhook Wompi:', err);
    }
});

/**
 * GET /api/payment/estado/:reference
 * Consulta el estado de un pago por reference
 * Requiere autenticación
 */
router.get('/estado/:reference', auth, async (req, res) => {
    const { reference } = req.params;

    try {
        // Verificar que el pago pertenece al usuario autenticado
        const userResult = await pool.query(
            'SELECT id FROM clientes_cloud WHERE email = $1',
            [req.user.email]
        );
        if (!userResult.rows[0]) {
            return res.status(403).json({ error: 'Acceso denegado' });
        }

        const result = await pool.query(`
            SELECT p.*, pl.nombre as plan_nombre
            FROM pagos_pendientes p
            LEFT JOIN planes_cloud pl ON p.plan_id = pl.plan_id
            WHERE p.reference = $1 AND p.cliente_cloud_id = $2
        `, [reference, userResult.rows[0].id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        res.json({ success: true, pago: result.rows[0] });

    } catch (err) {
        console.error('❌ Error consultando estado:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
