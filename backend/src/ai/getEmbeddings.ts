
import OpenAI from "openai";
import dotenv from "dotenv"

dotenv.config()

const openai = new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
})

export const generateEmbeddings = async (text : string): Promise<number[]> =>{
    const res = await openai.embeddings.create({
        model:"text-embedding-3-small",
        input:text
    })
    return res.data[0].embedding
}