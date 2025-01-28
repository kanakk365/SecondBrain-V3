import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const getTranscript = async (videoId: string): Promise<string> => {
    try {
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
        return transcriptItems.map(item => item.text).join(" ");
    } catch (error) {
        throw new Error("Transcript not available for this video");
    }
}

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genai.getGenerativeModel({ model: 'gemini-pro' });

const summarizeWithGemini = async (text: string): Promise<string> => {
    try {
        const prompt = `Summarize the following YouTube video transcript into 10 concise bullet points focusing on key points and main ideas. Use markdown formatting for the bullet points:\n\n${text}`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || "No summary generated";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "No summary generated"
    }
}

const run = async (url: string) => {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) {
            throw new Error("Invalid YouTube URL");
        }
        
        const transcript = await getTranscript(videoId);
        if (!transcript) {
            throw new Error("No transcript available");
        }
        
        const data = await summarizeWithGemini(transcript);
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
        process.exit(1);
    }
}

export default run;