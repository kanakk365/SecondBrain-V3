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
const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};
const getTranscript = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transcriptItems = yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId);
        return transcriptItems.map(item => item.text).join(" ");
    }
    catch (error) {
        throw new Error("Transcript not available for this video");
    }
});
const genai = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genai.getGenerativeModel({ model: 'gemini-pro' });
const summarizeWithGemini = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prompt = `Summarize the following YouTube video transcript into 10 concise bullet points focusing on key points and main ideas. Use markdown formatting for the bullet points:\n\n${text}`;
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        return response.text() || "No summary generated";
    }
    catch (error) {
        console.error("Gemini Error:", error);
        return "Please try again";
    }
});
const run = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = extractVideoId(url);
        if (!videoId) {
            throw new Error("Invalid YouTube URL");
        }
        const transcript = yield getTranscript(videoId);
        if (!transcript) {
            throw new Error("No transcript available");
        }
        const data = yield summarizeWithGemini(transcript);
        return data;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        }
        else {
            console.error("Unknown error:", error);
        }
        process.exit(1);
    }
});
exports.default = run;
