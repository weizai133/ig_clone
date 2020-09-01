"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = __importDefault(require("../controllers/userController"));
var router = express_1.Router();
var userController = new userController_1.default();
router.post('/checkUsername', function (req, res) {
    userController.find(req.body.username)
        .then(function (result) { return res.status(200).json({ success: true, result: result }); })
        .catch(function (error) { return res.status(500).json({ success: false, error: error }); });
});
router.get('/fetchUserProfile/:userId', function (req, res) {
    userController.userProfile(req.params.userId)
        .then(function (result) { return res.status(200).json({ success: true, result: result }); })
        .catch(function (error) { return res.status(500).json({ success: false, error: error }); });
});
module.exports = router;
