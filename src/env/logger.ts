import winston from 'winston';
import expressWinston from "express-winston";

const { format } = winston;
const { combine, timestamp, colorize } = format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize(),
    timestamp(),
    format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Http()
    // new winston.transports.File({ filename: './logs/ig.log' })
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
  ]
})

export const httpLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: combine(
    colorize(),
    timestamp(),
    format.simple()
  ),
  meta: false,
  colorize: true,
  msg: "method: {{req.method}} | status: {{res.statusCode}} | {{req.url}} {{res.responseTime}}ms"
})

export default logger