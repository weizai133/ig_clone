import Comment from "../modals/Comment";

export interface CommentService {
  /**
   * Create Comment
   */ 
  createComment(comment: Comment): Promise<number>
}