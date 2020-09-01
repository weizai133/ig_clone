"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = __importDefault(require("../env/db"));
var logger_1 = __importDefault(require("../env/logger"));
var Post = /** @class */ (function () {
    function Post() {
    }
    Post.prototype.fetchPostsByUserId = function (id, pageNo, pageSize) {
        if (pageNo === void 0) { pageNo = 0; }
        if (pageSize === void 0) { pageSize = 10; }
        return new Promise(function (resolve, reject) {
            var sqlQuery = 'SELECT f.follower_id, f.followee_id, p.id as post_id, p.image_url, p.created_at FROM follows f ';
            sqlQuery += 'INNER JOIN photos p ON p.user_id = f.followee_id ';
            sqlQuery += 'WHERE f.follower_id = ? ';
            sqlQuery += 'ORDER BY p.created_at DESC ';
            sqlQuery += "LIMIT " + pageNo + ", " + pageSize;
            db_1.default(sqlQuery, [id], function (err, rows) {
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
    };
    return Post;
}());
exports.default = Post;
