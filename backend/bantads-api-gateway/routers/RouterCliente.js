require('dotenv-safe').config();

const { Router } = require('express');
const httpProxy = require('express-http-proxy');
const { CLIENTE_API_URL } = require('../URLs');

const router = Router();

const clienteServiceProxy = httpProxy(CLIENTE_API_URL, {

    // intercepta o retorno da chamada ao /clientes
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {

        // (404) not found
        if (proxyRes.statusCode == 404) {
            userRes.status(404);
            return { message: 'Cliente não encontrado!' }
        } 
        
        else 
            return proxyResData

    }

});

/* CLIENTES */

/* CLIENTES */

// GET Clientes Route
router.get('/clientes', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// GET Cliente By Id Route
router.get('/clientes/:id', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// GET Clientes By Gerente Id Route
router.get('/gerentes/:id/clientes', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// POST Cliente Route (Autocadastro): orquestrador!

// PUT Cliente Route (Aprovar Autrocadastro): orquestrador!

// DELETE Cliente Route
router.delete('/clientes/:id', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

/* ENDEREÇOS */

// GET Endereços Route
router.get('/enderecos', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// GET Endereço By Id Route
router.get('/enderecos/:id', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// POST Endereço Route
router.post('/enderecos', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// PUT Endereço Route
router.put('/enderecos/:id', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

// DELETE Endereço Route
router.delete('/enderecos/:id', (req, res, next) => {
    clienteServiceProxy(req, res, next)
});

module.exports = router