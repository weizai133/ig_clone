"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = query;
