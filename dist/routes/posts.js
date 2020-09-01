"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var postController_1 = __importDefault(require("../controllers/postController"));
var router = express_1.Router();
var postsController = new postController_1.default();
router.get('/fetchPosts/:userId', function (req, res) {
    postsController.fetchPostsByUserId(req.params.userId, req.query.pageNo, req.query.pageSize)
        .then(function (result) { return res.status(200).json({ success: true, result: result }); })
        .catch(function (error) { return res.status(500).json({ success: false, error: error }); });
});
router.get('/fetchUserPosts/:userId', function (req, res) {
    postsController.fetchUserPosts(req.params.userId, req.query.pageNo, req.query.pageSize)
        .then(function (result) { return res.status(200).json({ success: true, result: result }); })
        .catch(function (error) { return res.status(500).json({ success: false, error: error }); });
});
module.exports = router;
