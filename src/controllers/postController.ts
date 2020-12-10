import query from "../env/db";
import logger from "../env/logger";
import { InsertRow } from "../modals/Common";
import Post, { Fetch_Posts, PostMeta, NumOfLikes, NumOfComments } from "../modals/Post";
import Comment from "../modals/Comment";
import PostServices from "../services/PostServices";
// import { lrange } from "../redis";
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

  fetchSubsribedPostsByUserId(id: string, lastPostId: number | undefined): Promise<Array<Fetch_Posts>> {
    return new Promise(async (resolve, reject) => {
      const limitNum = 20;

      logger.info('read Sql')
      let sqlQuery = 'select u.username, p.user_id as userId, p.id as post_id, p.created_at, p.image_url, p.content from photos p ';
      sqlQuery += `inner join (select followee_id from follows where follower_id = ${id} ) f on f.followee_id = p.user_id `;
      sqlQuery += 'inner join users u on u.id = p.user_id ';

      if (!!lastPostId) sqlQuery += `where p.id < ${lastPostId} and p.id >= ${lastPostId - limitNum} `;

      sqlQuery += `order by p.id desc limit ${limitNum}`;

      query(sqlQuery, [], async (err: Error, rows: Array<Fetch_Posts>) => {
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
      let sqlQuery: string = 'select p.id as postId, p.user_id, p.content, p.image_url, p.created_at FROM photos p ';
      sqlQuery += `where p.user_id = ${id} `;
      sqlQuery += 'ORDER BY p.created_at DESC ';
      sqlQuery += `limit ${pageNo}, ${pageSize}`;

      query(sqlQuery, [], (err: Error, rows: Array<Post>) => {
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
      sqlQuery += `WHERE c.photo_id = ${id} `;
      sqlQuery += `LIMIT ${pageNo}, ${pageSize};`;

      query(sqlQuery, [], (err: Error, rows: Array<Comment>) => {
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