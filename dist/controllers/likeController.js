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
exports.LikeController = void 0;
const redis_1 = require("../redis");
const db_1 = require("../env/db");
const logger_1 = __importDefault(require("../env/logger"));
const moment_1 = __importDefault(require("moment"));
const LikeCollections = 'like_collections';
class LikeController {
    constructor() {
        this.bulkInsertlikes = (postId, nums) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                for (let a = 1; a <= nums; a++) {
                    yield this.likeAPost({ photo_id: postId, user_id: String(a), created_at: moment_1.default().format("YYYY-MM-DD HH:mm:ss") });
                }
                return resolve();
            }));
        };
    }
    likeAPost(like) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let newPhotosLikes_key = `${like.photo_id}_likes`;
            const hasMember = yield redis_1.sismember(LikeCollections, newPhotosLikes_key);
            if (hasMember === 0)
                yield redis_1.sadd(LikeCollections, newPhotosLikes_key);
            // Check if user has liked the post
            const hasUserLikeThePost = yield redis_1.hexists(newPhotosLikes_key, like.user_id);
            if (hasUserLikeThePost) {
                yield redis_1.hdel(newPhotosLikes_key, like.user_id);
                return resolve();
            }
            yield redis_1.hmset(newPhotosLikes_key, { ['userId:' + like.user_id]: JSON.stringify(like) });
            return resolve();
        }));
    }
    insertLikesToDB() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const conn = yield db_1.getConn();
                const lock = yield redis_1.redlock.lock(`lock:${LikeCollections}`, 3000);
                const likesColl = yield redis_1.smembers(LikeCollections);
                (likesColl);
                const sql = 'insert into likes set user_id = ?, photo_id = ?, created_at = ?;';
                likesColl.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                    const nestedLock = yield redis_1.redlock.lock(`lock:${val}`, 1500);
                    const likeItemsFromRedis = yield redis_1.hkeys(val);
                    likeItemsFromRedis.map((el) => __awaiter(this, void 0, void 0, function* () {
                        const item = yield redis_1.hget(val, el);
                        let temp = JSON.parse(item);
                        yield db_1.beginTransaction(conn, sql, [temp.user_id, temp.photo_id, temp.created_at]);
                    }));
                    yield nestedLock.unlock();
                }));
                yield db_1.transactionCommit(conn);
                yield lock.unlock();
                likesColl.forEach((val) => __awaiter(this, void 0, void 0, function* () {
                    yield redis_1.srem(LikeCollections, val);
                }));
                conn.release();
                return resolve();
            }
            catch (error) {
                console.log(error);
                logger_1.default.error(error);
                reject(error);
            }
        }));
    }
    unlikeAPost(likeId, userId, postId) {
        throw new Error("Method not implemented.");
    }
}
exports.LikeController = LikeController;
