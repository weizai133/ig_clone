export default interface Comment {
  id: number,
  comment_text: string,
  photo_id: number,
  user_id: number,
  created_at: string,
  username?: string
}