"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mysql_1 = __importDefault(require("mysql"));
var logger_1 = __importDefault(require("./logger"));
var index_1 = __importDefault(require("./index"));
var pool = mysql_1.default.createPool(__assign({}, index_1.default.database));
var query = function (sql, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }
    pool.getConnection(function (err, conn) {
        if (err) {
            logger_1.default.error(err);
            callback(err, null, null);
        }
        else {
            conn.query(sql, options, function (err, result, fields) {
                callback(err, result, fields);
            });
            conn.release();
        }
    });
};
exports.default = query;
