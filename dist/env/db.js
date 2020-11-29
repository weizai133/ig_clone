"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleTransaction = exports.transactionCommit = exports.beginTransaction = exports.getConn = void 0;
const mysql_1 = __importDefault(require("mysql"));
const logger_1 = __importDefault(require("./logger"));
const index_1 = __importDefault(require("./index"));
var pool = mysql_1.default.createPool(Object.assign({}, index_1.default.database));
const query = (sql, options, callback) => {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    pool.getConnection((err, conn) => {
        if (err) {
            logger_1.default.error(err);
            callback(err, null, null);
        }
        else {
            conn.query(sql, options, (err, result, fields) => {
                callback(err, result, fields);
            });
            conn.release();
        }
    });
};
exports.getConn = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                logger_1.default.error(err);
                return reject(err);
            }
            return resolve(conn);
        });
    });
};
exports.beginTransaction = (conn, sql, values) => {
    return new Promise((resolve, reject) => {
        conn.query(sql, values, (err, res) => {
            if (err) {
                conn.rollback(() => {
                    logger_1.default.error(err);
                    return reject(err);
                });
            }
            return resolve(res);
        });
    });
};
exports.transactionCommit = (conn) => {
    return new Promise((resolve, reject) => {
        conn.commit((err) => {
            if (err) {
                logger_1.default.error(err);
                return reject(err);
            }
            return resolve();
        });
    });
};
exports.singleTransaction = (sql, values) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                logger_1.default.error(err);
                return reject(err);
            }
            conn.beginTransaction((err) => {
                if (err) {
                    logger_1.default.error(err);
                    throw err;
                }
                conn.query(sql, values, (err, res) => {
                    if (err) {
                        conn.rollback(() => {
                            logger_1.default.error(err);
                            return reject(err);
                        });
                    }
                    conn.commit((err) => {
                        logger_1.default.error(err);
                        return reject(err);
                    });
                    return resolve();
                });
            });
        });
    });
};
exports.default = query;
