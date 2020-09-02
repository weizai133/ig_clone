"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const { format } = winston_1.default;
const { combine, timestamp, colorize } = format;
const logger = winston_1.default.createLogger({
    level: 'info',
    format: combine(colorize(), timestamp(), format.simple()),
    transports: [
        new winston_1.default.transports.Console(),
        new winston_1.default.transports.Http()
        // new winston.transports.File({ filename: './logs/ig.log' })
        // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ]
});
exports.default = logger;
