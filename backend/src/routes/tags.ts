import { Router,Response, Request } from "express";
import { TagsModel } from "../db/db";


const tagRouter= Router()

tagRouter.get("/test", (req:Request, res:Response)=>{
    res.json({
        message:"testing tags route"
    })
})


tagRouter.post('/createtag', async (req:Request , res: Response)=>{
try {
    const {title} = req.body

    await TagsModel.create({
        title
    })

    res.status(201).json({
        message:"Tag is create"
    })
} catch (error) {
    res.status(500).json({
        message:"Something went wrong",
        error:error
    })
}
})


tagRouter.get("/alltags", async(req:Request, res:Response)=>{
    try {
        const tags= await TagsModel.find({},"_id title")
        res.status(200).json({
            tags,
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Error: Something went wrong!',
            error: error
          });
    }
})

export default tagRouter