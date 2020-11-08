import express, { Application } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import logger from "./env/logger";
import config from "./env";
import { redisClient } from "./redis";

const app: Application = express();

redisClient.on('ready', () => {
  logger.info('Redis is connected');
});

redisClient.on('error', (err) => {
  logger.error(err);
})

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan(function (tokens, req, res) {
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

app.listen(config.port, () => {
  logger.info("INS-backend is running on port " + config.port);
});