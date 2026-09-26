import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import router from "./routes/index.js";
import { pool } from "./db/index.js";
import { handleException, handleResponse } from "./utils/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Route
app.get("/", (_req: Request, res: Response) => {
  handleResponse(res, {
    status: 200,
    message: "read-it-later-service is running",
    data: {
      name: "read-it-later-service",
      version: "1.0.0",
      status: "healthy",
    },
  });
});

// API Routes
app.use("/api", router);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  handleResponse(res, {
    status: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: {},
  });
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  handleException(res, err);
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful Shutdown
const shutdown = async (signal: string) => {
  console.log(`\nReceived ${signal}, shutting down gracefully...`);
  server.close(async () => {
    console.log("HTTP server closed.");
    try {
      await pool.end();
      console.log("Database connection pool closed.");
    } catch (err) {
      console.error("Error during database disconnection:", err);
    }
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

export default app;
