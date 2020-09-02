import query from "../env/db";
import logger from "../env/logger";
import Post, { Fetch_Posts } from "../modals/Post";
import Comment from "../modals/Comment";
import PostServices from "../services/PostServices";

export default class PostController implements PostServices {
  fetchPostsByUserId(id: string, pageNo = 0, pageSize = 10 ): Promise<Array<Fetch_Posts>> {
    return new Promise((resolve, reject) => {
      let sqlQuery: string = 'SELECT f.follower_id, f.followee_id, p.id as post_id, p.image_url, p.created_at FROM follows f ';
      sqlQuery += 'INNER JOIN photos p ON p.user_id = f.followee_id '
      sqlQuery += 'WHERE f.follower_id = ? ';
      sqlQuery += 'ORDER BY p.created_at DESC ';
      sqlQuery += `LIMIT ${pageNo}, ${pageSize}`

      query(sqlQuery, [id], (err: Error, rows: Array<Fetch_Posts>) => {
        if (err) {
          logger.error(err);
          reject(err);
        } else if (rows.length >= 0) {
          resolve(rows);
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
}