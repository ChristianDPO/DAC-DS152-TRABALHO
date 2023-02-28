/* Sem Docker */
/* module.exports = {
    AUTH_API_URL: 'http://localhost:3001',
    GERENTE_API_URL: 'http://localhost:3002',
    CLIENTE_API_URL: 'http://localhost:3003',
    CONTA_API_URL: 'http://localhost:3004',
    ORQUESTRADOR_API_URL: 'http://localhost:3005'
}; */

/* Dentro do docker */
module.exports = {
    AUTH_API_URL: 'http://authentication-service:3001',
    GERENTE_API_URL: 'http://gerente-service:3002',
    CLIENTE_API_URL: 'http://cliente-service:3003',
    CONTA_API_URL: 'http://conta-service:3004',
    ORQUESTRADOR_API_URL: 'http://orquestrador-service:3005'
};