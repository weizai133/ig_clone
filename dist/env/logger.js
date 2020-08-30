"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
var winston_1 = __importDefault(require("winston"));
var express_winston_1 = __importDefault(require("express-winston"));
var format = winston_1.default.format;
var combine = format.combine, timestamp = format.timestamp, colorize = format.colorize;
var logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(colorize(), timestamp(), format.simple()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.Http()
        // new winston.transports.File({ filename: './logs/ig.log' })
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ]
});
exports.httpLogger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console()
    ],
    format: combine(colorize(), timestamp(), format.simple()),
    meta: false,
    colorize: true,
    msg: "method: {{req.method}} | status: {{res.statusCode}} | {{req.url}} {{res.responseTime}}ms"
});
exports.default = logger;
