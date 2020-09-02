import Post, { Fetch_Posts } from "../modals/Post";
import Comment from "../modals/Comment";

export default interface PostService {
  /**
   * fetch posts
   */
  fetchPostsByUserId(id: string, pageNo?: number, pageSize?: number): Promise<Array<Fetch_Posts>>;
  /**
   * fetch specific user's posts
   */
  fetchUserPosts(id: string, pageNo?: number, pageSize?: number): Promise<Array<Post>>
  /**
   * fetch Post's Comments
   */
  fetchCommentsByPostId(id: string, pageNo?: number, pageSize?:number): Promise<Array<Comment>>
}