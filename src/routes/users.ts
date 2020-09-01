import { Router, Request, Response, IRouter } from "express";
import UserController from "../controllers/userController";

const router: IRouter = Router();
const userController = new UserController();

router.post('/checkUsername', (req: Request, res: Response) => {
  userController.find(req.body.username)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(500).json({ success: false, error })});
})

router.get('/fetchUserProfile/:userId', (req: Request, res: Response) => {
  userController.userProfile(req.params.userId)
  .then(result => { return res.status(200).json({ success: true, result })})
  .catch(error => { return res.status(500).json({ success: false, error })});
})

module.exports = router;