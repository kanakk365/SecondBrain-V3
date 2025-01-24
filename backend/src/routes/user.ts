import { Request, Response, Router } from "express";
import { z } from "zod";
import bcryptjs from "bcryptjs" 
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from "../db/db";
import userMiddleware from "../middleware/middleware";
const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret"



const userRouter = Router();

userRouter.get("/test", (req: Request, res: Response) => {
    res.json({
        message: "testing route for user"
    })
})

userRouter.post("/signup", async (req: Request, res: Response) => {

    const requiredBody = z.object({
        email: z.string().min(1).max(30),
        password: z.string().min(6).max(30),
        username: z.string().min(1).max(30),
    })

    const parsedData = requiredBody.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({
            message: "something wrong with sever"
        })
    }

    const { username, email, password } = req.body

    try {
        const hashedPassword = await bcryptjs.hash(password, 5);
        console.log(hashedPassword);
        await UserModel.create({
            email,
            username,
            password: hashedPassword
        })
        res.json({
            message: "user signed up successfully"
        })

    } catch (error) {
        res.status(511).json({
            message: "Something went wrong!"
        })
    }
})


userRouter.post("/signin", async (req: Request, res: Response) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({
        username: username
    })
    if (!user) {
        res.status(403).json({
            message: "user not found"
        })
        return
    }
    const passCheck = user.password ? bcryptjs.compare(password, user.password) : false
    if (passCheck) {
        const token = jwt.sign({
            id: user._id.toString()
        }, USER_JWT_SECRET)
        console.log("token" + token)
        res.status(200).json({
            token: token,
            user: {
                "id": user._id,
                "username": user.username,
                "email": user.email
            }
        })
    } else {
        res.status(400).json({
            message: "incorrect credentials"
        })
    }
})

interface User {
    _id: string;
    username: string;
    email: string
}

interface customRequest extends Request {
    user?: User
}

userRouter.get('/contents', userMiddleware, async (req: customRequest, res: Response) => {
    try {
        // const userId = req.user?._id
        const userId= req.query.userID
        console.log("content")
        console.log(userId)
        const content = await ContentModel.find({ userId: userId }).populate({
            path: "tags",
            select: "title"
        })
        res.status(200).json(content)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" });
        return;
    }
})

export default userRouter