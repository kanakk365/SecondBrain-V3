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
const googleapis_1 = require("googleapis");
const generative_ai_1 = require("@google/generative-ai");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Initialize YouTube API
const youtube = googleapis_1.google.youtube('v3');
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
    var _a;
    try {
        if (!videoId)
            return "Invalid video ID provided";
        if (!process.env.YOUTUBE_API_KEY) {
            console.error("YouTube API key is missing");
            return "API configuration error";
        }
        // First, get the caption tracks
        const captions = yield youtube.captions.list({
            key: process.env.YOUTUBE_API_KEY,
            part: ['snippet'],
            videoId: videoId
        });
        // Find English captions
        const englishCaption = (_a = captions.data.items) === null || _a === void 0 ? void 0 : _a.find(caption => { var _a; return ((_a = caption.snippet) === null || _a === void 0 ? void 0 : _a.language) === 'en'; });
        if (!englishCaption || !englishCaption.id) {
            return "No English captions available for this video";
        }
        // Download the actual caption track
        const captionTrack = yield youtube.captions.download({
            key: process.env.YOUTUBE_API_KEY,
            id: englishCaption.id,
            tfmt: 'srt'
        });
        // Convert the caption data to plain text
        const transcriptText = captionTrack.data.toString()
            // Remove SRT formatting
            .replace(/\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n/g, '')
            // Remove empty lines
            .replace(/\n\n/g, ' ')
            // Remove remaining newlines
            .replace(/\n/g, ' ')
            // Remove multiple spaces
            .replace(/\s+/g, ' ')
            .trim();
        return transcriptText || "No transcript content found";
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`YouTube API Error:`, errorMessage);
        if (error instanceof Error && error.message.includes("quotaExceeded")) {
            return "YouTube API quota exceeded. Please try again tomorrow.";
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
        const transcript = yield getTranscript(videoId);
        if (transcript.includes("Failed to get transcript") ||
            transcript.includes("No English captions available")) {
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
