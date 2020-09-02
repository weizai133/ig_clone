"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../env/db"));
const logger_1 = __importDefault(require("../env/logger"));
class PostController {
    fetchPostsByUserId(id, pageNo = 0, pageSize = 10) {
        return new Promise((resolve, reject) => {
            let sqlQuery = 'SELECT f.follower_id, f.followee_id, p.id as post_id, p.image_url, p.created_at FROM follows f ';
            sqlQuery += 'INNER JOIN photos p ON p.user_id = f.followee_id ';
            sqlQuery += 'WHERE f.follower_id = ? ';
            sqlQuery += 'ORDER BY p.created_at DESC ';
            sqlQuery += `LIMIT ${pageNo}, ${pageSize}`;
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
}
exports.default = PostController;
