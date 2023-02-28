require('dotenv-safe').config();

const { Router } = require('express');
const httpProxy = require('express-http-proxy');
const { CONTA_API_URL } = require('../URLs');

const router = Router();

const contaServiceProxy = httpProxy(CONTA_API_URL);

/* CONTAS */

// GET Contas Route
router.get('/contas', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// GET Conta By Id Route
router.get('/contas/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// GET Conta By Cliente Route
router.get('/clientes/:id/contas', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// POST Conta Route
router.post('/contas', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// PUT Conta Route
router.put('/contas/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// DELETE Conta Route
router.delete('/contas/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

/* MOVIMENTAÇÕES */

// GET Conta Movimentações Route
router.get('/contas/:id/movimentacoes', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// GET Movimentações Route
router.get('/movimentacoes', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// GET Movimentação By Id Route
router.get('/movimentacoes/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// POST Movimentação Route: orquestrador!

// PUT Movimentação Route
router.put('/movimentacoes/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

// DELETE Movimentação Route
router.delete('/movimentacoes/:id', (req, res, next) => {
    contaServiceProxy(req, res, next)
});

module.exports = router