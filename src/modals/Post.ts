export default interface Post {
  id: number,
  image_url: string,
  user_id: number,
  created_at: string
}

export interface Fetch_Posts extends Post{
  username: string
}