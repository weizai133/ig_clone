"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const postController_1 = __importDefault(require("../controllers/postController"));
const router = express_1.Router();
const postsController = new postController_1.default();
router.get('/fetchSubscribedPosts/:userId', (req, res) => {
    postsController.fetchSubsribedPostsByUserId(req.params.userId, req.query.lastPostId)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(400).json({ success: false, error }); });
});
router.get('/fetchUserPosts/:userId', (req, res) => {
    postsController.fetchUserPosts(req.params.userId, req.query.pageNo, req.query.pageSize)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(400).json({ success: false, error }); });
});
router.get('/fetchCommentsByPostId/:postId', (req, res) => {
    postsController.fetchCommentsByPostId(req.params.postId, req.query.pageNo, req.query.pageSize)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(400).json({ success: false, error }); });
});
router.post('/createPost', (req, res) => {
    postsController.createPost(req.body)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(400).json({ success: false, error }); });
});
exports.default = router;
