const jwt = require('jsonwebtoken');

const httpProxy = require('express-http-proxy');

const { GERENTE_API_URL } = require('../URLs');

const gerenteServiceProxy = httpProxy('http://localhost:3002/gerentes', {

    // Acerta o header e o método
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        proxyReqOpts.headers['Content-Type'] = 'application/json';
        proxyReqOpts.method = 'GET';
        return proxyReqOpts;
    },

    // Acerta o retorno da verificação
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {

        // 200 (encontrou gerente): e-mail já cadastrado no sistema (409)
        if (proxyRes.statusCode == 200) {
            userRes.status(409);
            return { message: 'E-mail já cadastrado no sistema!' }
        }
        // 404 (não encontrou gerente): e-mail não cadastrado no sistema
        else if (proxyRes.statusCode == 404) {
            userRes.status(200);
            userRes.next
            return { message: 'Pode cadastrear...' }
        }

    },

    //skipToNextHandlerFilter: () => true,
});

module.exports = {

    // Middleware para verificar o token fornecido no header das requisições
    verifyJWT: (req, res, next) => {
        const token = req.headers['x-access-token'];

        if (!token)
            return res.status(401).json({ auth: false, message: 'Token não fornecido.' });

        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err)
                return res.status(401).json({ auth: false, message: 'Falha ao autenticar o token.' });

            req.userId = decoded.id;
            next();
        })
    },

    // Middleware para verificar duplicidade de cadastro
    verifyRegister: (req, res, next) => {

        console.log('Entrou no middleware verifyRegister...')

        gerenteServiceProxy(req, res, next)

        // Com o retorno do proxy verificaríamos se podemos prosseguir ou não...

        // 200 OK: email não cadastrado => next() para retornar para a rota
        // 409 CONFLICT: e-mail já cadastrado => retorna erro e para por aqui
    }
}