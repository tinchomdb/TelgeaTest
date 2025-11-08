import express, { Request, Response } from "express";
import cors from "cors";
import mvnoRoutes from "./routes/mvno.routes";
import { errorHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - in production, specify allowed origins
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.use("/api/normalize", mvnoRoutes);

// Error handling for 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(
    `SOAP normalization: POST http://localhost:${PORT}/api/normalize/soap`
  );
  console.log(
    `REST normalization: POST http://localhost:${PORT}/api/normalize/rest`
  );
});
