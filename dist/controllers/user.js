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
var db_1 = __importDefault(require("../env/db"));
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.find = function (username) {
        return new Promise(function (resolve, reject) {
            var sqlQuery = 'SELECT * FROM users WHERE username = ?';
            db_1.default(sqlQuery, [username], function (error, rows) {
                if (error)
                    return reject(error);
                else if (rows.length > 0)
                    resolve(__assign({}, rows[0]));
                else if (rows.length === 0)
                    reject(null);
            });
        });
    };
    return UserController;
}());
exports.default = UserController;
