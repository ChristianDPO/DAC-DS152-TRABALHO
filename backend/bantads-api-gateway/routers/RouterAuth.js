require('dotenv-safe').config();

const { Router } = require('express');
const httpProxy = require('express-http-proxy');
const jwt = require('jsonwebtoken');

const { AUTH_API_URL } = require('../URLs');

const router = Router();

const authServiceProxy = httpProxy(AUTH_API_URL, {

    // intercepta o retorno da chamada ao /login, para retornar corretamente os status code 
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {

        // autenticação correta (200): gera novo token e o retorna, juntamente com os dados do usuário
        if(proxyRes.statusCode == 200) {

            var str = Buffer.from(proxyResData).toString('utf-8');
            var objBody = JSON.parse(str);
            const id = objBody.id;
            const token = jwt.sign({id}, process.env.SECRET, {
                expiresIn: 1200 // 20 minutos
            });
            userRes.status(200);
            return { auth: true, token: token, data: objBody }

        } 

        // autenticação falha (401): retorna mensgem de erro
        else {
            userRes.status(401);
            return { message: 'Login ou Senha Inválidos!' }
        }
    }
    
});

// POST Login Route
router.post('/login', (req, res, next) => {
    authServiceProxy(req, res, next);
});

// POST Logout Route
router.post('/logout', (req, res) => {
    res.json({ auth: false, token: null });
})

module.exports = router