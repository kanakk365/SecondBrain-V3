import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../db/db";
dotenv.config()



const USER_JWT_SECRET = process.env.USER_JWT_SECRET || "randomjwtsecret";

interface userType {
    email: string;
    password: string;
    username: string;
    userId: string;

}

interface customRequest extends Request {
    user?: userType
}


async function userMiddleware(req: customRequest, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log("token" + token)
        if (!token) {
            res.status(401).json({
                message: "No token exist , auth denied"
            })
            return
        }

        const decoded = jwt.verify(token, USER_JWT_SECRET) as JwtPayload
        console.log(decoded)

        const userDoc = await UserModel.findById(decoded.id);
        if (!userDoc) {
            res.status(404).json({
                message: "User not found"
            })

            return
        }

        const user: userType = {
            email: userDoc.email || "",
            password: userDoc.password || "",
            username: userDoc.username || "",
            userId: userDoc._id.toString(), 
        };

        req.user = user 
        
        next()

    } catch (error) {
        console.error("Error in middleware" , error)
        res.status(401).json({
            message: "Token is not valid"
        })
        return
    }
}

export default userMiddleware