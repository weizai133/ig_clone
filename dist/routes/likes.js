"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController");
const router = express_1.Router();
const LikeCtrl = new likeController_1.LikeController();
router.post('/', (req, res) => {
    LikeCtrl.likeAPost(req.body)
        .then(result => { return res.status(201).json({ success: true, result }); })
        .catch(error => { return res.status(400).json({ success: false, error }); });
});
router.post('/testBulkInsert/:postId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield LikeCtrl.bulkInsertlikes(req.params.postId, 2);
        yield LikeCtrl.insertLikesToDB();
        res.status(200).send('ok');
    }
    catch (error) {
        res.status(400).json(error);
    }
}));
exports.default = router;
