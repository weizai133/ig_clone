"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const posts_1 = __importDefault(require("./routes/posts"));
const users_1 = __importDefault(require("./routes/users"));
const likes_1 = __importDefault(require("./routes/likes"));
const app = express_1.default();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    redis_1.redisClient.on('ready', () => {
        logger_1.default.info('Redis is connected');
    });
    redis_1.redisClient.on('error', (err) => {
        logger_1.default.error(err);
    });
    redis_1.redlock.on('clientError', (err) => {
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
    app.use('/user', users_1.default);
    app.use('/posts', posts_1.default);
    app.use('/like', likes_1.default);
    app.listen(env_1.default.port, () => {
        logger_1.default.info("INS-backend is running on port " + env_1.default.port);
    });
});
start();
