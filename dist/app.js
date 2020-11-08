"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = __importDefault(require("./env/logger"));
const env_1 = __importDefault(require("./env"));
const redis_1 = require("./redis");
const app = express_1.default();
redis_1.redisClient.on('ready', () => {
    logger_1.default.info('Redis is connected');
});
redis_1.redisClient.on('error', (err) => {
    logger_1.default.error(err);
});
app.use(helmet_1.default());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(morgan_1.default(function (tokens, req, res) {
    return [
        'Request:', tokens.method(req, res),
        tokens.url(req, res),
        'status:', tokens.status(req, res),
        'requestBody:', JSON.stringify(req.body),
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));
app.use('/user', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.listen(env_1.default.port, () => {
    logger_1.default.info("INS-backend is running on port " + env_1.default.port);
});
