"use strict";
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const user_1 = __importDefault(require("./routes/user"));
const content_1 = __importDefault(require("./routes/content"));
const tags_1 = __importDefault(require("./routes/tags"));
const brain_1 = __importDefault(require("./routes/brain"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Define the allowed origin
// const allowedOrigin = "https://second-brain-wine-sigma.vercel.app";
const allowedOrigin = " http://localhost:5173";
// CORS configuration
const corsOptions = {
    origin: allowedOrigin, // Allow requests from this specific origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies or authorization headers
};
// Apply CORS middleware with the configuration
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.get("/check", (req, res) => {
    res.json({
        message: "I am good",
    });
});
app.use("/api/v1/user", user_1.default);
app.use("/api/v1/content", content_1.default);
app.use("/api/v1/tag", tags_1.default);
app.use("/api/v1/brain", brain_1.default);
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
        });
    });
}
connect();
exports.default = app;
