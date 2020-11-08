import query from "../env/db";
import logger from "../env/logger";
import { InsertRow } from "../modals/Common";
import Post, { Fetch_Posts, PostMeta, NumOfLikes, NumOfComments } from "../modals/Post";
import Comment from "../modals/Comment";
import PostServices from "../services/PostServices";
import { lrange } from "../redis";
import { preLoadPostsList } from "../utils";

export default class PostController implements PostServices {
  createPost(newPost: Post): Promise<number> {
    return new Promise((resolve, reject) => {
      let sqlQuery: string = 'insert into photos set ?';
      query(sqlQuery, newPost, (err: Error, row: InsertRow) => {
        if (err) return reject(err)
        else if (row) resolve(row.insertId)
        else reject(null)
      })
    })
  }

  fetchPostsByUserId(id: string, pageNo = 0, pageSize = 20 ): Promise<Array<Fetch_Posts>> {
    return new Promise(async (resolve, reject) => {
      // Get memberlist from Redis first
      const res = await lrange(`${id}_membersList`, 0, 20);
      if (res && res.length > 0) {
        console.log('Read Redis');
        resolve(res.map(val => ({ ...JSON.parse(val) })));
        return
      }
      logger.info('read Sql')
      let sqlQuery = 'SELECT f.followee_id, p.id as post_id, users.username, p.image_url, p.created_at FROM follows f ';
      sqlQuery += 'LEFT JOIN photos p ON p.user_id = f.followee_id ';
      sqlQuery += 'LEFT JOIN users ON f.followee_id = users.id ';
      sqlQuery += 'WHERE f.follower_id = ? ';
      sqlQuery += 'ORDER BY p.created_at DESC ';
      sqlQuery += `LIMIT ${pageNo}, ${pageSize}`;

      query(sqlQuery, [id], async (err: Error, rows: Array<Fetch_Posts>) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else if (rows.length >= 0) {
          try {
            resolve(rows);
            await preLoadPostsList(`${id}_membersList`, rows);
            return;
          } catch (error) {
            logger.error(error)
            reject(error)
          }
        } else reject(null);
      })
    })
  }

  fetchUserPosts(id: string, pageNo = 0, pageSize = 10): Promise<Array<Post>> {
    return new Promise((resolve, reject) => {
      let sqlQuery: string = 'SELECT * FROM photos p WHERE user_id = ? ';
      sqlQuery += 'ORDER BY p.created_at DESC ';
      sqlQuery += `limit ${pageNo}, ${pageSize}`;

      query(sqlQuery, [id], (err: Error, rows: Array<Post>) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else if (rows.length >=0) {
          resolve(rows);
        }
        else reject(null);
      })
    })
  }

  fetchCommentsByPostId(id: string, pageNo = 0, pageSize = 2): Promise<Array<Comment>> {
    return new Promise((resolve, reject) => {
      let sqlQuery: string = 'SELECT c.id AS comment_id, users.id AS user_id, users.username, c.comment_text, c.photo_id, c.user_id, c.created_at FROM comments c ';
      sqlQuery += 'LEFT JOIN users ON c.user_id = users.id ';
      sqlQuery += 'WHERE c.photo_id = ? ';
      sqlQuery += `LIMIT ${pageNo}, ${pageSize};`;

      query(sqlQuery, [id], (err: Error, rows: Array<Comment>) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else if (rows.length >= 0) {
          resolve(rows);
        }
        else reject(null);
      })
    })
  }

  fetchMetaByPostId(id: number): Promise<PostMeta> {
    return new Promise((resolve, reject) => {
      let numOfLikesQuery: string = 'SELECT COUNT(*) AS num_of_likes FROM LIKES WHERE photo_id = ?';
      let numOfCommentsQuery: string = 'SELECT COUNT(*) AS num_of_comments FROM comments WHERE photo_id = ?';
      query(numOfLikesQuery, [id], (err: Error, numOfLikes: Array<NumOfLikes>) => {
        if (err) {
          return reject(err)
        }
        query(numOfCommentsQuery, [id], (err: Error, numOfComments: Array<NumOfComments>) => {
          if (err) {
            return reject(err)
          }
          return resolve({ ...numOfLikes[0], ...numOfComments[0] })
        })
      })
    })
  }
  
}