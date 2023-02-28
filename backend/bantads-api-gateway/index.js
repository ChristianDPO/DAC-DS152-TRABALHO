require('dotenv-safe').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
var bodyParser = require('body-parser');
var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // For legacy browser support
}

const app = express();
const { PORT } = process.env;

const { verifyJWT } = require('./middlewares')
const { RouterAuth, RouterGerente, RouterCliente, RouterConta, RouterOrquestrador } = require('./routers');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(helmet());

app.get('/', (_, res) => res.send('Hello from API Gateway!'));

app.use(RouterAuth);
app.use(RouterOrquestrador);

// Protected Routes
app.use(verifyJWT);

app.use(RouterGerente);
app.use(RouterCliente);
app.use(RouterConta);

// Must be placed after routes that use express-http-proxy
app.use(bodyParser.json());

var server = http.createServer(app);
server.listen(PORT, () => console.log(`BANTADS API Gateway app listening on port ${PORT}!`));