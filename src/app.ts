import express, { Application } from "express";
import bodyParser from "body-parser";
import logger from "./env/logger";
import config from "./env";
import morgan from "morgan";
import helmet from "helmet";

const app: Application = express();

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
  ].join(' ')
}));

app.use('/user', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

app.listen(config.port, () => {
  logger.info("INS-backend is running on port " + config.port);
});