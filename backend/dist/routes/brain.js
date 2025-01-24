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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const db_1 = require("../db/db");
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const brainRouter = (0, express_1.Router)();
const SHAREABLE_LINK_HOST = process.env.SHARABLE_LINK_HOST || "http://localhost:3000";
brainRouter.post("/share", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("here");
    console.log(req.user);
    try {
        const { share } = req.body;
        console.log(share, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId) {
            res.status(400).json({
                message: "User ID is needed"
            });
            return;
        }
        const existingLink = yield db_1.LinkModel.findOne({ userId });
        if (share) {
            if (existingLink) {
                const hashVal = existingLink.hash;
                res.status(200).json({
                    hashVal
                });
                return;
            }
            const hash = crypto_1.default.randomBytes(16).toString("hex");
            const newLink = yield db_1.LinkModel.create({ userId, hash });
            const hashVal = newLink.hash;
            res.status(200).json({
                hashVal
            });
            return;
        }
        else {
            if (existingLink) {
                yield db_1.LinkModel.deleteOne({ userId });
                res.status(200).json({ message: "Sharing disabled , link removed " });
            }
        }
    }
    catch (error) {
        console.error('Error toggling shareable link:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
        return;
    }
}));
brainRouter.get("/share/user/:userId", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const link = db_1.LinkModel.findOne({ userId });
    if (!link) {
        res.status(404).json({
            message: "No share hex found"
        });
        return;
    }
    res.status(200).json({
        link
    });
}));
brainRouter.get("/share/:hash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.hash;
        const link = yield db_1.LinkModel.findOne({ hash }).populate({
            path: "userId",
            select: "username",
        });
        if (!link) {
            res.status(404).json({
                message: "Invalid or expired link"
            });
            return;
        }
        const sharedContents = yield db_1.ContentModel.find({
            userId: link.userId
        });
        const user = link.userId;
        res.status(200).json({ user, sharedContents });
    }
    catch (error) {
        console.error('Error retrieving shared contents:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the shared contents' });
    }
}));
exports.default = brainRouter;
