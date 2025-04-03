import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import router from "./routes/index.js";
import { serveStaticFiles } from "./utils/Files.js";
import { app, server } from "./socket/index.js";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 55555; 
const isProduction = process.env.NODE_ENV === "production";

// Configure middleware
const configureMiddleware = () => {
  // CORS must come first to handle preflight OPTIONS requests
  app.use(cors(getCorsOptions()));

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: isProduction ? [] : null,
        },
      },
      xssFilter: true,
      noSniff: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: isProduction ? 500 : 1000, // More permissive in dev
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Cookie parser
  app.use(cookieParser(process.env.COOKIE_SECRET));

  // Response compression
  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) =>
        req.headers["x-no-compression"] ? false : compression.filter(req, res),
    })
  );

  // Body parsers
  app.use(
    express.json({
      limit: "10mb",
      verify: (req, res, buf) => {
        req.rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Passport initialization
  app.use(passport.initialize());

  // Request logging
  app.use(morgan(isProduction ? "combined" : "dev"));

  // Static files
  serveStaticFiles(app);
};

// CORS configuration
const getCorsOptions = () => ({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CREATOR_HOST,
      process.env.CLIENT_HOST,
    ].filter(Boolean);

    // console.log("CORS: Incoming origin:", origin); // Debug
    // console.log("CORS: Allowed origins:", allowedOrigins); // Debug

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow cookies/credentials
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 204,
  preflightContinue: false,
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Server error:", {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: isProduction ? "An error occurred" : err.message,
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

// Health check endpoint
const configureHealthCheck = () => {
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });
};

// Start the server
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });

  server.on("error", (error) => {
    // console.error("Server error:", error);
    process.exit(1);
  });
};

// Main application bootstrap
const bootstrap = async () => {
  try {
    // console.log("🚀 Initializing application...");
    // console.log("🔌 Connecting to database...");
    await dbConnection();
    // console.log("⚙️ Configuring middleware...");
    configureMiddleware();
    // console.log("🛡️ Setting up health check...");
    configureHealthCheck();
    // console.log("🔗 Mounting routes...");
    app.use("/api/v1", router);
    app.use(errorHandler);
    // console.log("🎉 Starting server...");
    startServer();
  } catch (error) {
    // console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

bootstrap();