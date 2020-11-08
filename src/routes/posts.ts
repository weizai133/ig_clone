import { Router, Request, Response, IRouter } from "express";
import PostsController from "../controllers/postController";
import { pageMeta } from "../modals/Common";

const router: IRouter = Router();
const postsController = new PostsController();

router.get('/fetchPosts/:userId', (req: Request, res: Response) => {
  postsController.fetchPostsByUserId(req.params.userId as string, req.query.pageNo as pageMeta, req.query.pageSize as pageMeta)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(400).json({ success: false, error })});
})

router.get('/fetchUserPosts/:userId', (req: Request, res: Response) => {
  postsController.fetchUserPosts(req.params.userId as string, req.query.pageNo as pageMeta, req.query.pageSize as pageMeta)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(400).json({ success: false, error })});
})

router.get('/fetchCommentsByPostId/:postId', (req: Request, res: Response) => {
  postsController.fetchCommentsByPostId(req.params.postId as string, req.query.pageNo as pageMeta, req.query.pageSize as pageMeta)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(400).json({ success: false, error })});
})

router.post('/createPost', (req: Request, res: Response) => {
  postsController.createPost(req.body)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(400).json({ success: false, error })});
})

module.exports = router;