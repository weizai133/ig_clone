"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const router = express_1.Router();
const userController = new userController_1.default();
router.post('/checkUsername', (req, res) => {
    userController.find(req.body.username)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(500).json({ success: false, error }); });
});
router.get('/fetchUserProfile/:userId', (req, res) => {
    userController.userProfile(req.params.userId)
        .then(result => { return res.status(200).json({ success: true, result }); })
        .catch(error => { return res.status(500).json({ success: false, error }); });
});
module.exports = router;
