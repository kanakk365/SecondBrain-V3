import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Never hardcode API keys!
});


const chunkText = (text: string, maxLength = 3000): string[] => {
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
        chunks.push(text.slice(i, i + maxLength));
    }
    return chunks;
}

const summarizeWithOpenAI = async (text: string): Promise<string> => {
    try {
        const chunks = chunkText(text);
        let fullSummary = "";
        
        for (const chunk of chunks) {
            const completion = await openai.chat.completions.create({
                messages: [{
                    role: "system",
                    content: "Summarize this YouTube video transcript in concise 10 bullet points. Focus on key points and main ideas. Use markdown formatting."
                }, {
                    role: "user",
                    content: chunk
                }],
                model: "gpt-3.5-turbo"
            });

            fullSummary += completion.choices[0].message.content + "\n";
        }

        return fullSummary || "No summary generated";
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate summary");
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
        
        const data = await summarizeWithOpenAI(transcript);
        return data
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
        process.exit(1);
    }
}


export default run