"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrange = exports.lPush = exports.setAsync = exports.setValue = exports.getValue = exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
const util_1 = require("util");
exports.redisClient = redis_1.default.createClient();
exports.getValue = (key) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.get(key, (err, value) => {
            if (err)
                reject(err);
            resolve(value);
        });
    });
};
exports.setValue = (key, value) => new Promise((resolve) => exports.redisClient.set(key, value, resolve));
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
