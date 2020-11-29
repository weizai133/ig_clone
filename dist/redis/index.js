"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.srem = exports.hdel = exports.hget = exports.hkeys = exports.hexists = exports.expire = exports.hmset = exports.sismember = exports.smembers = exports.sadd = exports.lrange = exports.lPush = exports.setValue = exports.getValue = exports.redlock = exports.redisClient = void 0;
const redis_1 = __importDefault(require("redis"));
const redlock_1 = __importDefault(require("redlock"));
const logger_1 = __importDefault(require("../env/logger"));
exports.redisClient = redis_1.default.createClient();
exports.redlock = new redlock_1.default([exports.redisClient], {
    driftFactor: 0.01,
    retryCount: 10,
    retryDelay: 200,
    retryJitter: 200
});
exports.getValue = (key) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.get(key, (err, value) => {
            if (err)
                return reject(err);
            return resolve(value);
        });
    });
};
exports.setValue = (key, value) => new Promise((resolve) => exports.redisClient.set(key, value, resolve));
exports.lPush = (key, value) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.lpush(key, value, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.lrange = (key, start, end) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.lrange(key, start, end, (err, res) => {
            if (err)
                return reject(null);
            return resolve(res);
        });
    });
};
exports.sadd = (key, value) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.sadd(key, value, (err, res) => {
            if (err)
                return reject(null);
            return resolve(res);
        });
    });
};
exports.smembers = (key) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.smembers(key, (err, res) => {
            return resolve(res);
        });
    });
};
exports.sismember = (key, member) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.sismember(key, member, (err, res) => {
            if (err) {
                logger_1.default.error(err);
                return reject(err);
            }
            return resolve(res);
        });
    });
};
exports.hmset = (key, obj) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.hmset(key, obj, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.expire = (key, seconds) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.expire(key, seconds, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.hexists = (key, field) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.hexists(key, field, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.hkeys = (key) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.hkeys(key, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.hget = (key, field) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.hget(key, field, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.hdel = (key, field) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.hdel(key, field, (err, res) => {
            if (err)
                return reject(err);
            return resolve(res);
        });
    });
};
exports.srem = (key, member) => {
    return new Promise((resolve, reject) => {
        exports.redisClient.srem(key, member, (err, res) => {
            if (err) {
                logger_1.default.error(err);
                return reject(err);
            }
            else if (res === 0) {
                logger_1.default.error(`${key} has not "${member}"`);
                return reject(null);
            }
            return resolve(res);
        });
    });
};
