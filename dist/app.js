"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var logger_1 = __importDefault(require("./env/logger"));
var env_1 = __importDefault(require("./env"));
var morgan_1 = __importDefault(require("morgan"));
var app = express_1.default();
app.use(morgan_1.default(function (tokens, req, res) {
    return [
        'Request:', tokens.method(req, res),
        tokens.url(req, res),
        'status:', tokens.status(req, res),
        'requestBody:', JSON.stringify(req.body),
        tokens['response-time'](req, res), 'ms'
    ].join(' ');
}));
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use('/user', require('./routes/users'));
app.use('/posts', require('./routes/posts'));
app.listen(env_1.default.port, function () {
    logger_1.default.info("INS-backend is running on port " + env_1.default.port);
});
