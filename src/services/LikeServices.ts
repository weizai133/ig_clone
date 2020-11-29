import { Like } from "../modals/Like";

export interface LikeService {
  /**
   * Like a post
   */
  likeAPost(like : Like): Promise<number>
  /**
   * Insert Likes to DB
   */
  insertLikesToDB(): Promise<null>
  /**
   * Unlike a post
   */
  unlikeAPost(likeId: number, userId: number, postId: number): Promise<null>
}