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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_transcript_1 = require("youtube-transcript");
const openai_1 = __importDefault(require("openai"));
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
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY // Never hardcode API keys!
});
const chunkText = (text, maxLength = 3000) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += maxLength) {
        chunks.push(text.slice(i, i + maxLength));
    }
    return chunks;
};
const summarizeWithOpenAI = (text) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chunks = chunkText(text);
        let fullSummary = "";
        for (const chunk of chunks) {
            const completion = yield openai.chat.completions.create({
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
    }
    catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to generate summary");
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
        const data = yield summarizeWithOpenAI(transcript);
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
