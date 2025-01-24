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

// Define the allowed origin
const allowedOrigin = "https://second-brain-wine-sigma.vercel.app";

// CORS configuration
const corsOptions = {
    origin: allowedOrigin, // Allow requests from this specific origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow cookies or authorization headers
};

// Apply CORS middleware with the configuration
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
