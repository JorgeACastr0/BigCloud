require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

const WOMPI_API = process.env.NODE_ENV === 'production'
    ? 'https://production.wompi.co/v1'
    : 'https://sandbox.wompi.co/v1';

/**
 * Genera la firma de integridad para el checkout de Wompi
 * Docs: https://docs.wompi.co/docs/colombia/widget-checkout-web
 */
function generateIntegritySignature(reference, amountInCents, currency = 'COP') {
    const secret = process.env.WOMPI_INTEGRITY_SECRET;
    if (!secret) throw new Error('WOMPI_INTEGRITY_SECRET no configurado en .env');
    const text = `${reference}${amountInCents}${currency}${secret}`;
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Verifica la firma de un evento webhook de Wompi
 * Docs: https://docs.wompi.co/docs/colombia/eventos
 */
function verifyWebhookSignature(eventBody, checksumHeader) {
    try {
        const secret = process.env.WOMPI_EVENTS_SECRET;
        if (!secret) return false;

        // Wompi firma: SHA256(properties + checksum)
        // El checksum viene en el header 'x-event-checksum'
        const properties = eventBody?.data?.transaction
            ? JSON.stringify(eventBody.data.transaction)
            : '';
        const timestamp = eventBody?.timestamp || '';
        const text = `${timestamp}${properties}${secret}`;
        const expected = crypto.createHash('sha256').update(text).digest('hex');
        return expected === checksumHeader;
    } catch (e) {
        console.error('Error verificando webhook Wompi:', e.message);
        return false;
    }
}

/**
 * Consulta el estado de una transacción en Wompi
 */
async function getTransactionStatus(transactionId) {
    try {
        const response = await axios.get(`${WOMPI_API}/transactions/${transactionId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.WOMPI_PRIVATE_KEY}`
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Error consultando transacción Wompi:', error.response?.data || error.message);
        throw new Error('No se pudo consultar la transacción');
    }
}

/**
 * Convierte USD a COP usando la tasa configurada en .env
 */
function usdToCopCents(amountUsd) {
    const rate = parseFloat(process.env.USD_TO_COP_RATE) || 4200;
    const cop = amountUsd * rate;
    return Math.round(cop * 100); // En centavos (como requiere Wompi)
}

module.exports = {
    generateIntegritySignature,
    verifyWebhookSignature,
    getTransactionStatus,
    usdToCopCents
};
