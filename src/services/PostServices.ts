import Post, { Fetch_Posts, PostMeta } from "../modals/Post";
import Comment from "../modals/Comment";

export default interface PostService {
  /**
   * fetch posts on main page
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
  /**
   * fetch meta data of a post 
   */
  fetchMetaByPostId(id: number): Promise<PostMeta>
  /**
   * Create Post
   */
  createPost(newPost: Post): Promise<number>
}