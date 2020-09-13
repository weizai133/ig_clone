import Comment from "./Comment";

export default interface Post {
  id: number,
  image_url: string,
  user_id: number,
  created_at: string
}

export interface Fetch_Posts extends PostMeta {
  follower_id: number,
  followee_id: number,
  post_id: number,
  image_url: number,
  created_at: number,
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
