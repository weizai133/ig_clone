import { Router, Request, Response, IRouter } from "express";
import { LikeController } from "../controllers/likeController";

const router: IRouter = Router();
const LikeCtrl = new LikeController();

router.post('/', (req: Request, res: Response) => {
  LikeCtrl.likeAPost(req.body)
  .then(result => { return res.status(201).json({ success: true, result })})
  .catch(error => { return res.status(400).json({ success: false, error })});
});

router.post('/testBulkInsert/:postId', async (req: Request, res: Response) => {
  try {
    await LikeCtrl.bulkInsertlikes(req.params.postId, 60);
    await LikeCtrl.insertLikesToDB();
    res.status(200).send('ok')
  } catch (error) {
   res.status(400).json(error) 
  }
})

export default router;