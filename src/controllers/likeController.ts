import { redlock, hmset, hexists, hdel, hkeys, hget, sadd, smembers, sismember, srem } from "../redis";
import { getConn, beginTransaction, doTransaction, transactionCommit } from "../env/db";
import logger from "../env/logger";
import { LikeRawBodyRedis, CreateLikeBody } from "../modals/Like";
import { LikeService } from "../services/LikeServices";
import moment from "moment";

const LikeCollections = 'like_collections';

export class LikeController implements LikeService {
  likeAPost(like: CreateLikeBody): Promise<number> {
    return new Promise(async (resolve, reject) => {
      let newPhotosLikes_key = `${like.photo_id}_likes`;

      const hasMember = await sismember(LikeCollections, newPhotosLikes_key);
      if (hasMember === 0) await sadd(LikeCollections, newPhotosLikes_key);
        
      // Check if user has liked the post
      const hasUserLikeThePost = await hexists(newPhotosLikes_key, like.user_id);
      if (hasUserLikeThePost) {
        await hdel(newPhotosLikes_key, like.user_id);
        return resolve();
      } 

      await hmset(newPhotosLikes_key, { ['userId:' + like.user_id]: JSON.stringify(like) });
      return resolve();
    })
  }  
  
  insertLikesToDB(): Promise<null> {
    return new Promise(async (resolve, reject) => {
      try {
        const conn = await getConn();

        const lock = await redlock.lock(`lock:${LikeCollections}`, 3000);
        const likesColl = await smembers(LikeCollections);
        (likesColl);
        const sql = 'insert into likes set user_id = ?, photo_id = ?, created_at = ?;'
        
        await beginTransaction(conn);
        likesColl.forEach(async val => {
          const nestedLock = await redlock.lock(`lock:${val}`, 1500);
          const likeItemsFromRedis = await hkeys(val);
          likeItemsFromRedis.map(async el => { 
                              const item = await hget(val, el);
                              let temp = JSON.parse(item) as LikeRawBodyRedis;
                              await doTransaction(conn, sql, [temp.user_id, temp.photo_id, temp.created_at]);
                            });
          await nestedLock.unlock();
        });
        await transactionCommit(conn);
        await lock.unlock();
        likesColl.forEach(async val => {
          await srem(LikeCollections, val);
        })
        conn.release();

        return resolve();
      } catch (error) {
        console.log(error)
        logger.error(error);
        reject(error);
      }
    })
  }

  unlikeAPost(likeId: number, userId: number, postId: number): Promise<null> {
    throw new Error("Method not implemented.");
  }

  bulkInsertlikes = (postId: string, nums: number): Promise<null> => {
    return new Promise(async (resolve, reject) => {
      for (let a = 1; a <= nums; a++) {
        await this.likeAPost({ photo_id: postId, user_id: String(a), created_at: moment().format("YYYY-MM-DD HH:mm:ss") });
      }
      return resolve();
    })
  }
}