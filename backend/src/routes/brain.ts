import { Request, Response, Router } from "express";
import userMiddleware from "../middleware/middleware";
import { ContentModel, LinkModel } from "../db/db";
import crypto from "crypto"
import dotenv from "dotenv"
dotenv.config()


const brainRouter = Router()
const SHAREABLE_LINK_HOST = process.env.SHARABLE_LINK_HOST || "http://localhost:3000"

interface User {
    _id: string,
    username: string,
    email: string,
    userId?:string
}

interface customRequest extends Request {
    user?: User
}

brainRouter.post("/share", userMiddleware , async (req: customRequest, res: Response) => {
    console.log("here")
    console.log(req.user)
    try {
        const { share } = req.body
        console.log(share , req.user?.userId)
        
        const userId = req.user?.userId

        if (!userId) {
            res.status(400).json({
                message: "User ID is needed"
            })
            return
        }

        const existingLink = await LinkModel.findOne({ userId })

        if (share) {
            if (existingLink) {
                const hashVal = existingLink.hash
                res.status(200).json({
                    hashVal
                })
                return;
            }
            const hash = crypto.randomBytes(16).toString("hex")
            const newLink = await LinkModel.create({ userId, hash })
            const hashVal = newLink.hash

            res.status(200).json({
                hashVal
            })
            return
        } else {
            if (existingLink) {
                await LinkModel.deleteOne({ userId })
                res.status(200).json({ message: "Sharing disabled , link removed " })
            }
        }

    } catch (error) {
        console.error('Error toggling shareable link:', error)
        res.status(500).json({ error: 'An error occurred while processing your request.' });
        return;
    }
})

brainRouter.get("/share/user/:userId", userMiddleware, async (req: customRequest, res: Response) => {
    const userId = req.params.userId

    const link = LinkModel.findOne({ userId })

    if (!link) {
        res.status(404).json({
            message: "No share hex found"
        })
        return
    }
    res.status(200).json({
        link
    })
})



brainRouter.get("/share/:hash", async (req: customRequest, res: Response) => {
    try {
        const hash = req.params.hash

        const link = await LinkModel.findOne({ hash }).populate({
            path: "userId",
            select: "username",
        })

        if (!link) {
            res.status(404).json({
                message: "Invalid or expired link"
            })
            return;
        }

        const sharedContents = await ContentModel.find({
            userId: link.userId
        })
        const user = link.userId
        res.status(200).json({ user, sharedContents });
    } catch (error) {
        console.error('Error retrieving shared contents:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the shared contents' });
    }
})

export default brainRouter