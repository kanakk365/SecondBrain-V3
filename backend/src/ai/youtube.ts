import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    
    const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
        /^([^"&?\/\s]{11})$/i
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
    }
    
    return null;
};

const getTranscript = async (videoId: string): Promise<string> => {
    try {
        if (!videoId) return "Invalid video ID provided";

        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, {
            lang: 'en'  // Only using supported configuration options
        });

        if (!transcriptItems || transcriptItems.length === 0) {
            return "No transcript available for this video";
        }

        return transcriptItems.map(item => item.text).join(" ");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Transcript Error: ${errorMessage}`);
        
        if (error instanceof Error && error.message.includes("No captions found")) {
            return "No captions available for this video. Please check if the video has closed captions enabled.";
        }
        
        return "No transcript generated";
    }
};

const initializeGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing in environment variables");
        return null;
    }

    try {
        const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        return genai.getGenerativeModel({ model: 'gemini-pro' });
    } catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        return null;
    }
};

const summarizeWithGemini = async (text: string): Promise<string> => {
    try {
        if (!text || text.length < 10) {
            return "Insufficient content to summarize";
        }

        const model = initializeGemini();
        if (!model) {
            return "AI model initialization failed";
        }

        const prompt = `
Please provide a comprehensive summary of the following YouTube video transcript. 
Format the output as follows:

1. Main Topic/Theme
2. Key Points (5-7 bullet points)
3. Important Details
4. Conclusion/Takeaways

Transcript:
${text}
`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text() || "Summary generation failed";
    } catch (error) {
        console.error("Gemini Error:", error);
        return "No summary generated";
    }
};

const run = async (url: string): Promise<string> => {
    try {
        if (!url) {
            return "URL is required";
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return "Invalid YouTube URL format";
        }
        
        const transcript = await getTranscript(videoId);
        if (transcript === "No transcript generated" || 
            transcript.includes("No captions available")) {
            return transcript;
        }
        
        const summary = await summarizeWithGemini(transcript);
        return summary;
    } catch (error) {
        console.error("Error in run function:", error);
        return "Failed to process video";
    }
};

export default run;