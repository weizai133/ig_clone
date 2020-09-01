import { Router, Request, Response, IRouter } from "express";
import PostsController from "../controllers/postController";

type pageMeta = number | undefined

const router: IRouter = Router();
const postsController = new PostsController();

router.get('/fetchPosts/:userId', (req: Request, res: Response) => {
  postsController.fetchPostsByUserId(req.params.userId as string, req.query.pageNo as pageMeta, req.query.pageSize as pageMeta)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(500).json({ success: false, error })});
})

router.get('/fetchUserPosts/:userId', (req: Request, res: Response) => {
  postsController.fetchUserPosts(req.params.userId as string, req.query.pageNo as pageMeta, req.query.pageSize as pageMeta)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(500).json({ success: false, error })});
})

module.exports = router;