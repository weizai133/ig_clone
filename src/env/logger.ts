import winston from 'winston';

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

export default logger