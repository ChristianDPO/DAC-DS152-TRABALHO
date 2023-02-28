require('dotenv-safe').config();

const { Router } = require('express');

const httpProxy = require('express-http-proxy');
const { verifyRegister, verifyJWT } = require('../middlewares')
const { ORQUESTRADOR_API_URL } = require('../URLs');

const router = Router();

const orquestradorServiceProxy = httpProxy(ORQUESTRADOR_API_URL);

// POST Cliente Route - SAGA Autocadastro
//router.post('/clientes', verifyJWT, verifyRegister, (req, res, next) => {
router.post('/clientes', (req, res, next) => {
    orquestradorServiceProxy(req, res, next)

});

// PUT Cliente Route
router.put('/clientes/:id', verifyJWT, (req, res, next) => {
    orquestradorServiceProxy(req, res, next)
});

// POST Movimentação Route - SAGA Saque, Depósito e Transferência
router.post('/movimentacoes', verifyJWT,  (req, res, next) => {
    orquestradorServiceProxy(req, res, next)
});

// POST Gerente Route - SAGA Inserir Gerente
//router.post('/gerentes', verifyRegister, (req, res, next) => {
//console.log('Passou pelo middleware e acessou a rota POST Gerentes...')
//res.send({message: 'RES.SEND Rota POST Gerente'})
router.post('/gerentes', verifyJWT, (req, res, next) => {
    orquestradorServiceProxy(req, res, next)
});

// DELETE Gerente Route - SAGA Remover Gerente
router.delete('/gerentes/:id', verifyJWT, (req, res, next) => {
    orquestradorServiceProxy(req, res, next)
});

module.exports = router