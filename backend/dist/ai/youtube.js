"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_transcript_1 = require("youtube-transcript");
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const extractVideoId = (url) => {
    if (!url)
        return null;
    const patterns = [
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
        /^([^"&?\/\s]{11})$/i
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1])
            return match[1];
    }
    return null;
};
const getTranscript = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!videoId)
            return "Invalid video ID provided";
        // Add a small delay to avoid rate limiting
        yield wait(1000);
        // Try English transcript first
        const transcriptItems = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
        if (!transcriptItems || transcriptItems.length === 0) {
            return "No transcript available for this video";
        }
        // Process transcript text
        const processedText = transcriptItems
            .map(item => item.text.trim())
            .filter(text => text.length > 0)
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
        if (!processedText) {
            return "Empty transcript content";
        }
        return processedText;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Transcript Error:`, errorMessage);
        if (error instanceof Error) {
            if (error.message.includes("too many requests")) {
                // Add longer delay for rate limiting
                yield wait(5000);
                try {
                    const retryTranscript = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
                    return retryTranscript.map(item => item.text).join(" ");
                }
                catch (retryError) {
                    console.error("Retry failed:", retryError);
                    return "Rate limit reached. Please try again later.";
                }
            }
            if (error.message.includes("No captions found")) {
                return "No captions available for this video";
            }
        }
        return "Failed to get transcript";
    }
});
const initializeGemini = () => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is missing in environment variables");
        return null;
    }
    try {
        const genai = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        return genai.getGenerativeModel({ model: 'gemini-pro' });
    }
    catch (error) {
        console.error("Failed to initialize Gemini AI:", error);
        return null;
    }
};
const summarizeWithGemini = (text) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        return response.text() || "Summary generation failed";
    }
    catch (error) {
        console.error("Gemini Error:", error);
        return "No summary generated";
    }
});
const run = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!url) {
            return "URL is required";
        }
        const videoId = extractVideoId(url);
        if (!videoId) {
            return "Invalid YouTube URL format";
        }
        let transcript = yield getTranscript(videoId);
        // If rate limited, try one more time after a delay
        if (transcript.includes("Rate limit reached")) {
            yield wait(10000); // Wait 10 seconds
            transcript = yield getTranscript(videoId);
        }
        if (transcript.includes("Failed to get transcript") ||
            transcript.includes("No captions available")) {
            return transcript;
        }
        const summary = yield summarizeWithGemini(transcript);
        return summary;
    }
    catch (error) {
        console.error("Error in run function:", error);
        return "Failed to process video";
    }
});
exports.default = run;
