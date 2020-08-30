import express, { Application } from "express";
import bodyParser from "body-parser";
import logger, { httpLogger } from "./env/logger";
import config from "./env";

const app: Application = express();

app.use(httpLogger);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth', require('./routes/users'));

app.listen(config.port, () => {
  logger.info("INS-backend is running on port " + config.port);
})