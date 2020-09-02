"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbHost = process.env.dbHost || 'localhost';
const dbUser = process.env.dbUser || 'root';
const dbPassword = process.env.dbPasswor || 'root';
const dbName = process.env.dbName || 'ig_clone';
const port = process.env.port || 3001;
const database = {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
};
exports.default = { database, port };
