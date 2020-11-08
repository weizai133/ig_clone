import Comment from "./Comment";

export default interface Post {
  user_id: number,
  id: number | null,
  content: string | null,
  image_url: string | null,
  created_at: string
}

export interface Fetch_Posts extends PostMeta {
  follower_id: number,
  followee_id: number,
  post_id: number,
  content: string,
  image_url: string,
  created_at: string
  // username: string
}

export interface Posts extends Post {
  comments: Array<Comment>
}

export interface NumOfLikes {
  num_of_likes: number
}

export interface NumOfComments {
  num_of_comments: number
}

export interface PostMeta extends NumOfLikes, NumOfComments {}

export interface PostObjInRedis {
  userId: number,
  postId: number,
  created_at: string
}