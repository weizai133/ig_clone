"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_1 = __importDefault(require("../controllers/user"));
var router = express_1.Router();
var user = new user_1.default();
router.post('/checkUsername', function (req, res) {
    user.find(req.body.username)
        .then(function (result) {
        res.status(200).json({ success: true, result: result });
    });
});
module.exports = router;
