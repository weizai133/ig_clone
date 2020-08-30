"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dbHost = process.env.dbHost || 'localhost';
var dbUser = process.env.dbUser || 'root';
var dbPassword = process.env.dbPasswor || 'root';
var dbName = process.env.dbName || 'ig_clone';
var port = process.env.port || 3001;
var database = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
};
exports.default = { database: database, port: port };
