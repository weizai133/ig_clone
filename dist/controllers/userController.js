"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../env/db"));
const logger_1 = __importDefault(require("../env/logger"));
class UserController {
    find(username) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM users WHERE username = ?';
            db_1.default(sqlQuery, [username], (error, rows) => {
                if (error) {
                    logger_1.default.error(error);
                    return reject(error);
                }
                else if (rows.length >= 0)
                    resolve(Object.assign({}, rows[0]));
                else
                    reject(null);
            });
        });
    }
    fetchNumOfFollowers(id) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT COUNT(*) as num_of_followers FROM follows WHERE followee_id = ?';
            db_1.default(sqlQuery, [id], (error, rows) => {
                if (error) {
                    logger_1.default.error(error);
                    return reject(error);
                }
                else if (rows.length >= 0) {
                    resolve(Object.assign({}, rows[0]));
                }
                else
                    reject(null);
            });
        });
    }
    fetchNumOfFollowings(id) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT COUNT(*) as num_of_followings FROM follows WHERE follower_id = ?';
            db_1.default(sqlQuery, [id], (error, rows) => {
                if (error) {
                    logger_1.default.error(error);
                    return reject(error);
                }
                else if (rows.length >= 0) {
                    resolve(Object.assign({}, rows[0]));
                }
                else
                    reject(null);
            });
        });
    }
    fecthNumOfPosts(id) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT COUNT(*) as num_of_posts FROM photos where user_id = ?';
            db_1.default(sqlQuery, [id], (error, rows) => {
                if (error) {
                    logger_1.default.error(error);
                    return reject(error);
                }
                else if (rows.length >= 0) {
                    resolve(Object.assign({}, rows[0]));
                }
                else
                    reject(null);
            });
        });
    }
    userProfile(id) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const nf = yield this.fetchNumOfFollowers(id);
                const nfing = yield this.fetchNumOfFollowings(id);
                const np = yield this.fecthNumOfPosts(id);
                resolve(Object.assign(Object.assign(Object.assign({}, nf), nfing), np));
            }
            catch (error) {
                logger_1.default.error(error);
                reject(error);
            }
        }));
    }
}
exports.default = UserController;
