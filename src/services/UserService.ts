import User from "../modals/User";

export default interface UserService{
  /**
   * Search user by username
   */
  find(username: string) : Promise<User | Error>
}