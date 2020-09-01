import User, { UserInfo, NumOfPosts, NumOfFollowers, NumOfFollowings } from "../modals/User";

export default interface UserService{
  /**
   * Search user by username
   */
  find(username: string) : Promise<User | Error>
  /**
   * Fetch User profile
   */
  userProfile(id: string): Promise<UserInfo>
  /**
   * Fetch the number of User followers
   */
  fetchNumOfFollowers(id: string): Promise<NumOfFollowers>
  /**
   * Fetch the number of User followees
   */
  fetchNumOfFollowings(id: string): Promise<NumOfFollowings>
  /**
   * Fetch the number of Posts
   */
  fecthNumOfPosts(id: string): Promise<NumOfPosts>
}