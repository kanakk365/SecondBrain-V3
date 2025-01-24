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
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db/db");
const middleware_1 = __importDefault(require("../middleware/middleware"));
const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret";
const userRouter = (0, express_1.Router)();
userRouter.get("/test", (req, res) => {
    res.json({
        message: "testing route for user"
    });
});
userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredBody = zod_1.z.object({
        email: zod_1.z.string().min(1).max(30),
        password: zod_1.z.string().min(6).max(30),
        username: zod_1.z.string().min(1).max(30),
    });
    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "something wrong with sever"
        });
    }
    const { username, email, password } = req.body;
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 5);
        console.log(hashedPassword);
        yield db_1.UserModel.create({
            email,
            username,
            password: hashedPassword
        });
        res.json({
            message: "user signed up successfully"
        });
    }
    catch (error) {
        res.status(511).json({
            message: "Something went wrong!"
        });
    }
}));
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield db_1.UserModel.findOne({
        username: username
    });
    if (!user) {
        res.status(403).json({
            message: "user not found"
        });
        return;
    }
    const passCheck = user.password ? bcryptjs_1.default.compare(password, user.password) : false;
    if (passCheck) {
        const token = jsonwebtoken_1.default.sign({
            id: user._id.toString()
        }, USER_JWT_SECRET);
        console.log("token" + token);
        res.status(200).json({
            token: token,
            user: {
                "id": user._id,
                "username": user.username,
                "email": user.email
            }
        });
    }
    else {
        res.status(400).json({
            message: "incorrect credentials"
        });
    }
}));
userRouter.get('/contents', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const userId = req.user?._id
        const userId = req.query.userID;
        console.log("content");
        console.log(userId);
        const content = yield db_1.ContentModel.find({ userId: userId }).populate({
            path: "tags",
            select: "title"
        });
        res.status(200).json(content);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
}));
exports.default = userRouter;
