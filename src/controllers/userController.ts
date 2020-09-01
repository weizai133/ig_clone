import User, { UserInfo, NumOfPosts, NumOfFollowers, NumOfFollowings } from "../modals/User";
import UserService from "../services/UserService";
import query from "../env/db";
import logger from "../env/logger";

export default class UserController implements UserService {
  find(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      let sqlQuery: string = 'SELECT * FROM users WHERE username = ?';
      query(sqlQuery, [username], (error: Error, rows: Array<User>) => {
        if (error) {
          logger.error(error);
          return reject(error);
        }
        else if (rows.length >= 0) resolve({ ...rows[0] })
        else reject(null)
      })
    });
  }

  fetchNumOfFollowers(id: string): Promise<NumOfFollowers> {
    return new Promise((resolve, reject) => {
      let sqlQuery = 'SELECT COUNT(*) as num_of_followers FROM follows WHERE followee_id = ?';
      query(sqlQuery, [id], (error: Error, rows: Array<NumOfFollowers>) => {
        if (error) {
          logger.error(error);
          return reject(error);
        } else if (rows.length >= 0) {
          resolve({ ...rows[0] })
        } else reject(null)
      })
    })
  }

  fetchNumOfFollowings(id: string): Promise<NumOfFollowings> {
    return new Promise((resolve, reject) => {
      let sqlQuery = 'SELECT COUNT(*) as num_of_followings FROM follows WHERE follower_id = ?';
      query(sqlQuery, [id], (error: Error, rows: Array<NumOfFollowings>) => {
        if (error) {
          logger.error(error);
          return reject(error);
        } else if (rows.length >= 0) {
          resolve({ ...rows[0] })
        } else reject(null)
      })
    })
  }

  fecthNumOfPosts(id: string): Promise<NumOfPosts> {
    return new Promise((resolve, reject) => {
      let sqlQuery = 'SELECT COUNT(*) as num_of_posts FROM photos where user_id = ?';
      query(sqlQuery, [id], (error: Error, rows: Array<NumOfPosts>) => {
        if (error) {
          logger.error(error);
          return reject(error);
        } else if (rows.length >= 0) {
          resolve({ ...rows[0] })
        } else reject(null)
      })
    })
  }

  userProfile(id: string): Promise<UserInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const nf = await this.fetchNumOfFollowers(id);
        const nfing = await this.fetchNumOfFollowings(id);
        const np = await this.fecthNumOfPosts(id);

        resolve({ ...nf, ...nfing, ...np });
      } catch (error) {
        logger.error(error)
        reject(error);
      }
    })
  }

}