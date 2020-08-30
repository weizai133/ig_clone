import { Router, Request, Response, IRouter } from "express";
import User from "../controllers/user";

const router: IRouter = Router();
const user = new User();


router.post('/checkUsername', (req: Request, res: Response) => {
  user.find(req.body.username)
  .then(result => {
    res.status(200).json({ success: true, result })
  })
})

module.exports = router;