"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrange = exports.lPush = exports.setAsync = exports.getAsync = exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
exports.redisClient = redis_1.default.createClient();
exports.getAsync = util_1.promisify(exports.redisClient.get);
exports.setAsync = util_1.promisify(exports.redisClient.set);
exports.lPush = (key, value) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.lpush(key, value, (err, res) => {
            if (err)
                return reject(err);
            resolve(res);
        });
    });
};
exports.lrange = (key, start, end) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.lrange(key, start, end, (err, res) => {
            if (err)
                reject(null);
            resolve(res);
        });
    });
};
