import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import userRouter from "./routes/user";
import contentRouter from "./routes/content";
import tagRouter from "./routes/tags";
import brainRouter from "./routes/brain";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Define allowed web origin
const allowedWebOrigin = "https://second-brain-wine-sigma.vercel.app";

// CORS configuration using a function to validate origin.
interface ICorsOriginCallback {
    (err: Error | null, allow?: boolean): void;
}

interface ICorsOptions {
    origin: (origin: string | undefined, callback: ICorsOriginCallback) => void;
    methods: string[];
    allowedHeaders: string[];
    credentials: boolean;
}

const corsOptions: ICorsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow requests from the defined web origin.
        if (origin === allowedWebOrigin) {
            return callback(null, true);
        }
        
        // Allow all locally loaded Chrome extensions
        if (origin.startsWith("chrome-extension://")) {
            return callback(null, true);
        }
        
        callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/check", (req, res) => {
  res.json({
    message: "I am good",
  });
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/content", contentRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/brain", brainRouter);

async function connect() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} at http://localhost:${PORT}`);
  });
}
connect();

export default app;