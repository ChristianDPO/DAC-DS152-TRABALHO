require('dotenv-safe').config();

const { Router } = require('express');
const httpProxy = require('express-http-proxy');
const { GERENTE_API_URL } = require('../URLs');

const router = Router();

const gerenteServiceProxy = httpProxy(GERENTE_API_URL);

// GET Gerentes Route
router.get('/gerentes', (req, res, next) => {
    gerenteServiceProxy(req, res, next);
});

// GET Gerente By Id Route
router.get('/gerentes/:id', (req, res, next) => {
    gerenteServiceProxy(req, res, next);
});

// POST Gerente Route: orquestrador!

// PUT Gerente Route
router.put('/gerentes/:id', (req, res, next) => {
    gerenteServiceProxy(req, res, next)
});

// DELETE Gerente Route: orquestrador!

module.exports = router