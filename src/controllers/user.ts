import User from "../modals/User";
import UserService from "../services/UserService";
import query from "../env/db";

export default class UserController implements UserService {
  find(username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      let sqlQuery = 'SELECT * FROM users WHERE username = ?';
      query(sqlQuery, [username], (error: Error, rows: Array<User>) => {
        if (error) return reject(error);
        else if (rows.length > 0) resolve({ ...rows[0] })
        else if (rows.length === 0) reject(null)
      })
    });
  }
}