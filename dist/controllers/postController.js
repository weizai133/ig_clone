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
const redis_1 = require("../redis");
const utils_1 = require("../utils");
class PostController {
    createPost(newPost) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'insert into photos set ?';
            db_1.default(sqlQuery, newPost, (err, row) => {
                if (err)
                    return reject(err);
                else if (row)
                    resolve(row.insertId);
                else
                    reject(null);
            });
        });
    }
    fetchPostsByUserId(id, pageNo = 0, pageSize = 20) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            // Try to get memberlist from Redis first
            const res = yield redis_1.lrange(`${id}_membersList`, pageNo, pageSize);
            if (res && res.length > 0) {
                logger_1.default.info('Read Redis');
                resolve(res.map(val => (Object.assign({}, JSON.parse(val)))));
                return;
            }
            logger_1.default.info('read Sql');
            let sqlQuery = 'select u.username, p.user_id, p.id as post_id, p.created_at, p.image_url, p.content from photos p ';
            sqlQuery += 'inner join (select followee_id from follows where follower_id = ? ) f on f.followee_id = p.user_id ';
            sqlQuery += 'left join users u on u.id = p.user_id ';
            sqlQuery += 'order by p.created_at desc ';
            sqlQuery += `LIMIT ${pageNo}, ${pageSize}`;
            db_1.default(sqlQuery, [id], (err, rows) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    logger_1.default.error(err);
                    reject(err);
                }
                else if (rows.length >= 0) {
                    try {
                        resolve(rows);
                        yield utils_1.preLoadPostsList(`${id}_membersList`, rows);
                        return;
                    }
                    catch (error) {
                        logger_1.default.error(error);
                        reject(error);
                    }
                }
                else
                    reject(null);
            }));
        }));
    }
    fetchUserPosts(id, pageNo = 0, pageSize = 10) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT * FROM photos p WHERE user_id = ? ';
            sqlQuery += 'ORDER BY p.created_at DESC ';
            sqlQuery += `limit ${pageNo}, ${pageSize}`;
            db_1.default(sqlQuery, [id], (err, rows) => {
                if (err) {
                    logger_1.default.error(err);
                    reject(err);
                }
                else if (rows.length >= 0) {
                    resolve(rows);
                }
                else
                    reject(null);
            });
        });
    }
    fetchCommentsByPostId(id, pageNo = 0, pageSize = 2) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT c.id AS comment_id, users.id AS user_id, users.username, c.comment_text, c.photo_id, c.user_id, c.created_at FROM comments c ';
            sqlQuery += 'LEFT JOIN users ON c.user_id = users.id ';
            sqlQuery += 'WHERE c.photo_id = ? ';
            sqlQuery += `LIMIT ${pageNo}, ${pageSize};`;
            db_1.default(sqlQuery, [id], (err, rows) => {
                if (err) {
                    logger_1.default.error(err);
                    reject(err);
                }
                else if (rows.length >= 0) {
                    resolve(rows);
                }
                else
                    reject(null);
            });
        });
    }
    fetchMetaByPostId(id) {
        return new Promise((resolve, reject) => {
            let numOfLikesQuery = 'SELECT COUNT(*) AS num_of_likes FROM LIKES WHERE photo_id = ?';
            let numOfCommentsQuery = 'SELECT COUNT(*) AS num_of_comments FROM comments WHERE photo_id = ?';
            db_1.default(numOfLikesQuery, [id], (err, numOfLikes) => {
                if (err) {
                    return reject(err);
                }
                db_1.default(numOfCommentsQuery, [id], (err, numOfComments) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(Object.assign(Object.assign({}, numOfLikes[0]), numOfComments[0]));
                });
            });
        });
    }
}
exports.default = PostController;
