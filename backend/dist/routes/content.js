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
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../db/db");
const contentRouter = (0, express_1.Router)();
contentRouter.get("./test", (req, res) => {
    res.json({
        message: "testing /content/test route"
    });
});
contentRouter.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { link, type, title, description, tags, userId } = req.body;
        if (!link || !type || !title || !description || !tags || !userId) {
            res.status(500).json({
                message: "Please enter all details"
            });
            return;
        }
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            description,
            date: Date.now(),
            tags,
            userId
        });
        res.status(201).json({
            message: "Content created"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error something went wrong",
            error: error
        });
    }
}));
contentRouter.delete("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { contentId, userId } = req.body;
        if (!contentId || !userId) {
            res.status(400).json({
                message: "Content ID and User ID are required"
            });
            return;
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(contentId)) {
            res.status(400).json({
                message: "Invalid Content id"
            });
            return;
        }
        const content = yield db_1.ContentModel.findById(contentId);
        if (!content) {
            res.status(404).json({
                message: "Content not found"
            });
            return;
        }
        if (content.userId && content.userId.toString() !== userId) {
            res.status(403).json({
                message: "You are not authorized to delete this content"
            });
        }
        yield db_1.ContentModel.findByIdAndDelete(contentId);
        res.status(200).json({
            message: "Content deleted successfully"
        });
        return;
    }
    catch (error) {
        console.error("Error deleting content : ", error);
        res.status(500).json({
            message: "Internal server error"
        });
        return;
    }
}));
exports.default = contentRouter;
